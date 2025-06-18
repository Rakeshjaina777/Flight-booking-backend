import { IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({
    example: 'c68f8d03-6077-44aa-a2b6-60d3b86d8bc5',
    required: false,
    description: 'UUID of the existing fare object (optional)',
  })
  @IsOptional()
  @IsString()
  fareId?: string;
}
