import { Module } from '@nestjs/common';
import { SeatController } from './controller/seat.controller';
import { SeatService } from './service/seat.service';

@Module({
  controllers: [SeatController],
  providers: [SeatService]
})
export class SeatModule {}
