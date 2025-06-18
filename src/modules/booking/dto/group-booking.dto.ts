// dto/group-booking.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum, IsInt, Min } from 'class-validator';
import { SeatClass } from '@prisma/client';

export class GroupBookingDto {
  @ApiProperty({
    example: 'user-uuid',
    description: 'User ID making the booking',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    example: 'flight-uuid',
    description: 'Flight ID to book seats in',
  })
  @IsUUID()
  flightId: string;

  @ApiProperty({
    enum: SeatClass,
    example: 'ECONOMY',
    description: 'Class of seats to book',
  })
  @IsEnum(SeatClass)
  seatClass: SeatClass;

  @ApiProperty({ example: 3, description: 'Number of adjacent seats to book' })
  @IsInt()
  @Min(1)
  count: number;
}
