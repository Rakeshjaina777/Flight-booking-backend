import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FareService } from '../service/fare.service';
import { CalculateFareDto } from '../dto/calculate-fare.dto';

@ApiTags('Fare')
@Controller('fare')
export class FareController {
  constructor(private readonly fareService: FareService) {}

  @ApiOperation({ summary: 'Admin: Set base fare for a flight' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        flightId: {
          type: 'string',
          example: '30031659-7ac0-4fe7-9160-30eaaee4724c',
        },
        economy: { type: 'number', example: 3000 },
        business: { type: 'number', example: 6000 },
        first: { type: 'number', example: 12000 },
      },
      required: ['flightId', 'economy', 'business', 'first'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Base fare set and linked to the flight',
    schema: {
      example: {
        id: '30031659-7ac0-4fe7-9160-30eaaee4724c',
        economy: 3000,
        business: 6000,
        first: 12000,
        createdAt: '2025-06-18T12:00:00.000Z',
        updatedAt: '2025-06-18T12:00:00.000Z',
      },
    },
  })
  @Post('set')
  setBaseFare(
    @Body()
    body: {
      flightId: string;
      economy: number;
      business: number;
      first: number;
    },
  ) {
    return this.fareService.setBaseFare(
      body.flightId,
      body.economy,
      body.business,
      body.first,
    );
  }

  @ApiOperation({
    summary: 'User: Calculate dynamic fare based on flight and seat context',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns calculated fare and breakdown',
    schema: {
      example: {
        finalFare: 3350,
        breakdown: {
          baseFare: 3000,
          windowCharge: 200,
          ageDiscount: -150,
          surgeMultiplier: 1.1,
          timeAdjustment: 1.05,
        },
      },
    },
  })
  @ApiOperation({
    summary: 'User: Calculate dynamic fare based on flight and seat context',
  })
  @ApiBody({
    type: CalculateFareDto,
    examples: {
      example1: {
        summary: 'Example Fare Calculation Payload',
        value: {
          flightId: '30031659-7ac0-4fe7-9160-30eaaee4724c',
          seatClass: 'ECONOMY',
          isWindow: true,
          passengerAge: 65,
          bookedSeats: 80,
          totalSeats: 100,
          timeBeforeDepartureInMinutes: 90,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the calculated final fare and detailed breakdown',
    schema: {
      example: {
        finalFare: 3465,
        breakdown: {
          baseFare: 3000,
          windowCharge: 200,
          ageDiscount: -150,
          surgeMultiplier: 1.1,
          timeAdjustment: 1.05,
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Flight or fare not found' })
  @Post('calculate')
  calculateFare(@Body() dto: CalculateFareDto) {
    return this.fareService.calculate(dto);
  }
}
