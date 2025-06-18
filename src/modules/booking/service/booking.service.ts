import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { lockSeat, isSeatLocked } from 'src/common/utils/seat-lock.util';
import { PrismaService } from 'prisma/prisma.service';
import { GroupBookingDto } from '../dto/group-booking.dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  /**
   * Lock a seat for a user temporarily (180 seconds)
   */
  async lockSeat(seatId: string, userId: string) {
    const seat = await this.prisma.seat.findUnique({ where: { id: seatId } });
    if (!seat) throw new NotFoundException('❌ Seat not found');

    if (seat.isBooked || isSeatLocked(seatId)) {
      throw new ConflictException('⛔ Seat already locked or booked');
    }

    const locked = lockSeat(seatId, 180); // Lock for 180 seconds
    if (!locked) throw new ConflictException('⏳ Seat is temporarily locked');

    const flight = await this.prisma.flight.findUnique({
      where: { id: seat.flightId },
      select: {
        id: true,
        from: true,
        to: true,
        departure: true,
        arrival: true,
      },
    });

    return {
      message: '✅ Seat locked successfully',
      seatId,
      userId,
      lockDuration: 180,
      flightDetails: flight,
    };
  }

  /**
   * Confirm a booking: update booking table and lock seat
   */
  async confirmBooking(dto: CreateBookingDto) {
    const seat = await this.prisma.seat.findUnique({
      where: { id: dto.seatId },
    });

    if (!seat || seat.isBooked) {
      throw new ConflictException('❗ Seat is already booked or not available');
    }

    const booking = await this.prisma.booking.create({
      data: {
        userId: dto.userId,
        flightId: dto.flightId,
        seatId: dto.seatId,
        finalFare: dto.finalFare,
      },
    });

    await this.prisma.seat.update({
      where: { id: dto.seatId },
      data: {
        isBooked: true,
        bookingId: booking.id, // Required to maintain referential integrity
      },
    });

    return {
      message: '🎫 Booking confirmed!',
      bookingId: booking.id,
      userId: dto.userId,
      seatId: dto.seatId,
      booking,
    };
  }

  /**
   * Cancel a booking and free the seat
   */
  async cancelBooking(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException('❌ Booking not found');

    if (!booking.seatId) {
      throw new ConflictException('❗ Booking does not have a valid seatId');
    }
    await this.prisma.seat.update({
      where: { id: booking.seatId },
      data: {
        isBooked: false,
        bookingId: null,
      },
    });

    await this.prisma.booking.delete({ where: { id: bookingId } });

    return {
      message: '❌ Booking cancelled and seat released',
      seatId: booking.seatId,
      userId: booking.userId,
    };
  }

  /**
   * Retrieve bookings and orphaned booked seats for a user
   */
  async getUserBookings(userId: string) {
    const bookings = await this.prisma.booking.findMany({
      where: { userId },
      include: {
        flight: true,
        seat: true,
      },
    });

    // Optional fallback for orphaned booked seats (inconsistent data)
    const orphanedSeats = await this.prisma.seat.findMany({
      where: {
        bookingId: null,
        isBooked: true,
        flight: {
          bookings: {
            some: {
              userId,
            },
          },
        },
      },
      include: {
        flight: true,
      },
    });

    if (bookings.length === 0 && orphanedSeats.length === 0) {
      throw new NotFoundException(
        'No bookings or booked seats found for this user',
      );
    }

    return {
      message: '📦 Bookings and seats retrieved successfully',
      activeBookings: bookings,
      orphanedBookedSeats: orphanedSeats,
    };
  }
  async confirmGroupBooking(dto: GroupBookingDto) {
    const availableSeats = await this.prisma.seat.findMany({
      where: {
        flightId: dto.flightId,
        seatClass: dto.seatClass,
        isBooked: false,
      },
      orderBy: { seatNumber: 'asc' },
    });

    if (availableSeats.length < dto.count) {
      throw new ConflictException('Not enough available seats');
    }

    const seatsToBook = availableSeats.slice(0, dto.count);

    const bookings = await Promise.all(
      seatsToBook.map((seat) =>
        this.prisma.booking.create({
          data: {
            userId: dto.userId,
            flightId: dto.flightId,
            seatId: seat.id,
            finalFare: 2500, // can replace with calculatedFare logic
          },
        }),
      ),
    );

    await this.prisma.seat.updateMany({
      where: { id: { in: seatsToBook.map((s) => s.id) } },
      data: { isBooked: true },
    });

    return { message: 'Group booking confirmed', bookings };
  }
}
