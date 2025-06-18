import { Controller, Post, Body, Param, Delete, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { BookingService } from '../service/booking.service';
import { CreateBookingDto, LockSeatDto } from '../dto/create-booking.dto';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @Post('lock/:seatId')
  @ApiOperation({ summary: 'Lock a seat for 180 seconds for a user' })
  @ApiBody({
    type: LockSeatDto,
    examples: {
      example1: {
        value: { userId: 'user-1234-uuid' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Seat locked response with user and flight info',
    schema: {
      example: {
        message: '✅ Seat locked successfully',
        seatId: 'seat-uuid',
        userId: 'user-uuid',
        lockDuration: 180,
        flightDetails: {
          id: 'flight-uuid',
          from: 'Delhi',
          to: 'Mumbai',
          departure: '2025-06-22T10:00:00Z',
          arrival: '2025-06-22T12:00:00Z',
        },
      },
    },
  })
  lockSeat(@Param('seatId') seatId: string, @Body() body: LockSeatDto) {
    return this.bookingService.lockSeat(seatId, body.userId);
  }

  @ApiOperation({ summary: '✅ Confirm a booking' })
  @ApiBody({
    type: CreateBookingDto,
    examples: {
      example1: {
        summary: 'Booking Payload',
        value: {
          userId: 'user-uuid',
          seatId: 'seat-uuid',
          flightId: 'flight-uuid',
          finalFare: 3200,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Booking success response',
    schema: {
      example: {
        message: '🎫 Booking confirmed!',
        userId: 'user-uuid',
        seatId: 'seat-uuid',
        booking: {
          id: 'booking-id',
          userId: 'user-uuid',
          flightId: 'flight-uuid',
          seatId: 'seat-uuid',
          finalFare: 3200,
          createdAt: '2025-06-18T14:35:12.000Z',
        },
      },
    },
  })
  @Post('confirm')
  confirm(@Body() dto: CreateBookingDto) {
    return this.bookingService.confirmBooking(dto);
  }

  @ApiOperation({ summary: '❌ Cancel a booking' })
  @ApiResponse({
    status: 200,
    description: 'Booking cancelled and seat released',
    schema: {
      example: {
        message: '❌ Booking cancelled and seat released',
        seatId: 'seat-uuid',
        userId: 'user-uuid',
      },
    },
  })
  @Delete(':bookingId')
  cancel(@Param('bookingId') id: string) {
    return this.bookingService.cancelBooking(id);
  }

  @ApiOperation({ summary: '👤 Get bookings by user ID' })
  @ApiResponse({
    status: 200,
    description: 'List of bookings for the user',
  })
  @Get('user/:userId')
  getBookings(@Param('userId') userId: string) {
    return this.bookingService.getUserBookings(userId);
  }
}
