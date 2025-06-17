import { Module } from '@nestjs/common';
import { FlightController } from './controller/flight.controller';
import { FlightService } from './service/flight.service';

@Module({
  controllers: [FlightController],
  providers: [FlightService],
  exports: [FlightService],
})
export class FlightModule {}
