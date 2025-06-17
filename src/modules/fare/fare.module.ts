import { Module } from '@nestjs/common';
import { FareController } from './controller/fare.controller';
import { FareService } from './service/fare.service';

@Module({
  controllers: [FareController],
  providers: [FareService]
})
export class FareModule {}
