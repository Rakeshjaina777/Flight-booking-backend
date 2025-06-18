import { Controller, Post, Body, Param, Delete, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { BookingService } from '../service/booking.service';
import { CreateBookingDto, LockSeatDto } from '../dto/create-booking.dto';
import { GroupBookingDto } from '../dto/group-booking.dto';

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
  @Post('group')
  @ApiOperation({ summary: 'Book multiple adjacent seats (Group Booking)' })
  @ApiBody({
    type: GroupBookingDto,
    examples: {
      example: {
        summary: 'Sample group booking payload',
        value: {
          userId: 'effb2932-9351-4b1e-9dc1-957289f7f88c',
          flightId: '30031659-7ac0-4fe7-9160-30eaaee4724c',
          seatClass: 'ECONOMY',
          count: 3,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Seats booked successfully for a group',
    schema: {
      example: {
        message: 'Group booking confirmed',
        bookings: [
          {
            id: 'booking-1-uuid',
            userId: 'effb2932-9351-4b1e-9dc1-957289f7f88c',
            flightId: '30031659-7ac0-4fe7-9160-30eaaee4724c',
            seatId: 'seat-1-uuid',
            finalFare: 2500,
            createdAt: '2025-06-18T12:00:00.000Z',
          },
          {
            id: 'booking-2-uuid',
            userId: 'f8d5fa92-8f5e-4efb-b5d4-9bc450b1e599',
            flightId: 'd20ea712-d3cb-4292-a83f-0a4aa6d1aafe',
            seatId: 'seat-2-uuid',
            finalFare: 2500,
            createdAt: '2025-06-18T12:00:01.000Z',
          },
          {
            id: 'booking-3-uuid',
            userId: 'f8d5fa92-8f5e-4efb-b5d4-9bc450b1e599',
            flightId: 'd20ea712-d3cb-4292-a83f-0a4aa6d1aafe',
            seatId: 'seat-3-uuid',
            finalFare: 2500,
            createdAt: '2025-06-18T12:00:02.000Z',
          },
        ],
      },
    },
  })
  confirmGroupBooking(@Body() dto: GroupBookingDto) {
    return this.bookingService.confirmGroupBooking(dto);
  }
}
