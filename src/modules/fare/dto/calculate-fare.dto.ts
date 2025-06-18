import { SeatClass } from '@prisma/client';
import { IsEnum, IsUUID, IsBoolean, IsInt, Min } from 'class-validator';

export class CalculateFareDto {
  @IsUUID()
  flightId: string;

  @IsEnum(SeatClass)
  seatClass: SeatClass;

  @IsBoolean()
  isWindow: boolean;

  @IsInt()
  @Min(0)
  passengerAge: number;

  @IsInt()
  totalSeats: number;

  @IsInt()
  bookedSeats: number;

  @IsInt()
  timeBeforeDepartureInMinutes: number;
}
