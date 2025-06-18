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
        flightId: { type: 'string', example: 'flight-uuid' },
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
        id: 'fare-uuid',
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
  @Post('calculate')
  calculateFare(@Body() dto: CalculateFareDto) {
    return this.fareService.calculate(dto);
  }
}
