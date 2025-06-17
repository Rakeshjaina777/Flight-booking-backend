import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateFlightDto {
  @IsNotEmpty()
  from: string;

  @IsNotEmpty()
  to: string;

  @IsDateString()
  departure: string;

  @IsDateString()
  arrival: string;

  @IsUUID()
  fareId: string;
}
