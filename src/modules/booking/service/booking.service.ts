import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { lockSeat, isSeatLocked } from 'src/common/utils/seat-lock.util';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  /**
   * Locks a seat for 180 seconds for a specific user
   */
  async lockSeat(seatId: string, userId: string) {
    const seat = await this.prisma.seat.findUnique({ where: { id: seatId } });
    if (!seat) throw new NotFoundException('❌ Seat not found');

    if (seat.isBooked || isSeatLocked(seatId)) {
      throw new ConflictException('⛔ Seat already locked or booked');
    }

    const locked = lockSeat(seatId, 180); // Lock seat temporarily
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
   * Confirms a booking and marks seat as booked
   */
  async confirmBooking(dto: CreateBookingDto) {
    const seat = await this.prisma.seat.findUnique({
      where: { id: dto.seatId },
    });

    if (!seat || seat.isBooked)
      throw new ConflictException('Seat is already booked');

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
        bookingId: booking.id, // ✅ FIX HERE
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
   * Cancels a booking and resets the seat
   */
  async cancelBooking(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new NotFoundException('❌ Booking not found');

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
   * Gets user's bookings and any orphaned seats
   */
  async getUserBookings(userId: string) {
    const bookings = await this.prisma.booking.findMany({
      where: { userId },
      include: {
        flight: true,
        seat: true,
      },
    });

    // Booked seats without a booking ID (data inconsistency or partial flow)
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
}
