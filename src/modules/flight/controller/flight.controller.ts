import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Patch,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

import { FlightService } from '../service/flight.service';
import { CreateFlightDto } from '../dto/create-flight.dto';
import { UpdateFlightStatusDto } from '../dto/update-flight-status.dto';

@ApiTags('Flights')
@Controller('flights')
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @ApiOperation({ summary: 'Admin: Create a new flight' })
  @ApiBody({
    type: CreateFlightDto,
    examples: {
      example1: {
        summary: 'Example flight creation payload',
        value: {
          from: 'Delhi',
          to: 'Mumbai',
          departure: '2025-06-25T10:00:00.000Z',
          arrival: '2025-06-25T12:30:00.000Z',
          fareId: 'fare-uuid',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Flight created successfully',
    schema: {
      example: {
        id: 'flight-uuid',
        from: 'Delhi',
        to: 'Mumbai',
        departure: '2025-06-25T10:00:00.000Z',
        arrival: '2025-06-25T12:30:00.000Z',
        status: 'ON_TIME',
        fareId: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: '2025-06-18T00:00:00.000Z',
      },
    },
  })
  @Post()
  create(@Body() dto: CreateFlightDto) {
    return this.flightService.create(dto);
  }

  @ApiOperation({ summary: 'User: Search flights by from/to/date' })
  @ApiQuery({ name: 'from', required: true, example: 'Delhi' })
  @ApiQuery({ name: 'to', required: true, example: 'Mumbai' })
  @ApiQuery({ name: 'date', required: true, example: '2025-06-25' })
  @ApiResponse({
    status: 200,
    description: 'List of matching flights',
    schema: {
      example: [
        {
          id: 'flight-uuid',
          from: 'Delhi',
          to: 'Mumbai',
          departure: '2025-06-25T10:00:00.000Z',
          arrival: '2025-06-25T12:30:00.000Z',
          status: 'ON_TIME',
        },
      ],
    },
  })
  @Get('search')
  search(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('date') date: string,
  ) {
    return this.flightService.findFiltered(from, to, date);
  }

  @ApiOperation({ summary: 'Public: Get all flights' })
  @ApiResponse({
    status: 200,
    description: 'Returns all flights',
    schema: {
      example: [
        {
          id: 'flight-uuid',
          from: 'Delhi',
          to: 'Mumbai',
          status: 'ON_TIME',
        },
      ],
    },
  })
  @Get()
  findAll() {
    return this.flightService.findAll();
  }

  @ApiOperation({ summary: 'Admin: Update flight status' })
  @ApiBody({
    type: UpdateFlightStatusDto,
    examples: {
      example1: {
        summary: 'Flight status update payload',
        value: {
          status: 'CANCELLED',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Flight status updated',
    schema: {
      example: {
        id: 'flight-uuid',
        status: 'CANCELLED',
      },
    },
  })
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateFlightStatusDto) {
    return this.flightService.updateStatus(id, dto);
  }
}
