import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum FlightStatus {
  ON_TIME = 'ON_TIME',
  DELAYED = 'DELAYED',
  CANCELLED = 'CANCELLED',
}

export class UpdateFlightStatusDto {
  @ApiProperty({ enum: FlightStatus, example: 'CANCELLED' })
  @IsEnum(FlightStatus)
  status: FlightStatus;
}
