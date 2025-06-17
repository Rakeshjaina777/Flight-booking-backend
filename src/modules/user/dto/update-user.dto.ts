// update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ example: 'UpdatedName' })
  name?: string;

  @ApiPropertyOptional({ example: 'updated@example.com' })
  email?: string;

  @ApiPropertyOptional({ example: 35 })
  age?: number;

  @ApiPropertyOptional({ example: 'NewPassword@456' })
  password?: string;

  
}
