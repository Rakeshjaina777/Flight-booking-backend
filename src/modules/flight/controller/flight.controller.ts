import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { FlightService } from '../service/flight.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CreateFlightDto } from '../dto/create-flight.dto';
import { UpdateFlightStatusDto } from '../dto/update-flight-status.dto';

@ApiTags('Flights')
@Controller('flights')
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @ApiOperation({ summary: 'Admin: Create a new flight' })
  
 
  @Post()
  create(@Body() dto: CreateFlightDto) {
    return this.flightService.create(dto);
  }

  @ApiOperation({ summary: 'User: Search flights by from/to/date' })
  @Get('search')
  @ApiQuery({ name: 'from', required: true })
  @ApiQuery({ name: 'to', required: true })
  @ApiQuery({ name: 'date', required: true })
  search(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('date') date: string,
  ) {
    return this.flightService.findFiltered(from, to, date);
  }

  @ApiOperation({ summary: 'Public: Get all flights' })
  @Get()
  findAll() {
    return this.flightService.findAll();
  }

  @ApiOperation({ summary: 'Admin: Update flight status' })
 
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateFlightStatusDto) {
    return this.flightService.updateStatus(id, dto);
  }
}
