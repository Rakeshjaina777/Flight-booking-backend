import { IsUUID, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the user making the booking',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: '987e6543-e21b-12d3-a456-426614174000',
    description: 'ID of the flight being booked',
  })
  @IsUUID()
  @IsNotEmpty()
  flightId: string;

  @ApiProperty({
    example: 'a1b2c3d4-e89b-12d3-a456-426614174000',
    description: 'ID of the seat to book',
  })
  @IsUUID()
  @IsNotEmpty()
  seatId: string;

  @ApiProperty({
    example: 4500.5,
    description: 'Final fare amount after calculations',
  })
  @IsNumber()
  @IsNotEmpty()
  finalFare: number;
}

export class LockSeatDto {
  @ApiProperty({
    example: '07addb7-1929-43aa-b49e-fa4db1dba40f',
    description: 'The UUID of the user attempting to lock the seat',
  })
  @IsUUID()
  userId: string;
}