import { FlightStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateFlightStatusDto {
  @IsEnum(FlightStatus)
  status: FlightStatus;
}
