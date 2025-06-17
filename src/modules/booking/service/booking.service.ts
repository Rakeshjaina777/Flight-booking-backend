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

  async lockSeat(seatId: string) {
    const seat = await this.prisma.seat.findUnique({ where: { id: seatId } });
    if (!seat) throw new NotFoundException('Seat not found');
    if (seat.isBooked || isSeatLocked(seatId)) {
      throw new ConflictException('Seat already locked or booked');
    }
    const locked = lockSeat(seatId);
    if (!locked) throw new ConflictException('Seat is temporarily locked');
    return { message: 'Seat locked for 90 seconds' };
  }

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
      data: { isBooked: true },
    });

    return { message: 'Booking successful', booking };
  }

  async cancelBooking(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    await this.prisma.seat.update({
      where: { id: booking.seatId },
      data: { isBooked: false },
    });

    await this.prisma.booking.delete({ where: { id: bookingId } });

    return { message: 'Booking cancelled and seat released' };
  }

  getUserBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        flight: true,
        seat: true,
      },
    });
  }
}
