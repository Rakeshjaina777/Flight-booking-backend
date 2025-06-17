import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsDateString } from 'class-validator';

export class CreateFlightDto {
  @ApiProperty({ example: 'Delhi' })
  @IsString()
  from: string;

  @ApiProperty({ example: 'Mumbai' })
  @IsString()
  to: string;

  @ApiProperty({ example: '2025-06-25T10:00:00.000Z' })
  @IsDateString()
  departure: string;

  @ApiProperty({ example: '2025-06-25T12:30:00.000Z' })
  @IsDateString()
  arrival: string;

  @ApiProperty({ example: 'fare-uuid' })
  @IsUUID()
  fareId: string;
}
