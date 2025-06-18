import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { FareService } from '../service/fare.service';
import { CalculateFareDto } from '../dto/calculate-fare.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Fare')
@Controller('fare')
export class FareController {
  constructor(private readonly fareService: FareService) {}

  @ApiOperation({ summary: 'Admin: Set base fare for a flight' })
  
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

  @ApiOperation({ summary: 'User: Calculate dynamic fare' })
 
  @Post('calculate')
  calculateFare(@Body() dto: CalculateFareDto) {
    return this.fareService.calculate(dto);
  }
}
