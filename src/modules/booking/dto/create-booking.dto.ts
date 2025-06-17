import { IsUUID, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  flightId: string;

  @IsUUID()
  seatId: string;

  @IsNumber()
  finalFare: number;
}
