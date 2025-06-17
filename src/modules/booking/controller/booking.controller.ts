import { Controller, Post, Body, Param, Delete, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { BookingService } from '../service/booking.service';
import { CreateBookingDto } from '../dto/create-booking.dto';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiOperation({ summary: 'Lock a seat for 90 seconds' })
  @Post('lock/:seatId')
  lockSeat(@Param('seatId') seatId: string) {
    return this.bookingService.lockSeat(seatId);
  }

  @ApiOperation({ summary: 'Confirm a booking' })
  @ApiBody({
    description: 'Booking details payload',
    type: CreateBookingDto,
    examples: {
      example1: {
        summary: 'Sample booking body',
        value: {
          userId: '123e4567-e89b-12d3-a456-426614174000',
          flightId: '987e6543-e21b-12d3-a456-426614174000',
          seatId: 'a1b2c3d4-e89b-12d3-a456-426614174000',
          finalFare: 4500.5,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Booking confirmed successfully',
    schema: {
      example: {
        id: 'booking-uuid',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        flightId: '987e6543-e21b-12d3-a456-426614174000',
        seatId: 'a1b2c3d4-e89b-12d3-a456-426614174000',
        finalFare: 4500.5,
        createdAt: '2025-06-18T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed or seat already booked',
    schema: {
      example: {
        statusCode: 400,
        message: ['seatId must be a UUID'],
        error: 'Bad Request',
      },
    },
  })
  @Post('confirm')
  confirm(@Body() dto: CreateBookingDto) {
    return this.bookingService.confirmBooking(dto);
  }

  @ApiOperation({ summary: 'Cancel a booking' })
  @Delete(':bookingId')
  cancel(@Param('bookingId') id: string) {
    return this.bookingService.cancelBooking(id);
  }

  @ApiOperation({ summary: 'Get bookings for a user' })
  @Get('user/:userId')
  getBookings(@Param('userId') userId: string) {
    return this.bookingService.getUserBookings(userId);
  }
}
