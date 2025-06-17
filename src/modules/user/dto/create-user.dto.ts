// create-user.dto.ts
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class CreateUserDto {
  @ApiProperty({ example: 'Rakesh Jain', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'rakesh@example.com',
    description: 'Email address (must be unique)',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 30, description: 'Age of the user' })
  @IsInt()
  @Min(0)
  age: number;

  @ApiProperty({
    example: 'SecurePass@123',
    description: 'Secure password (min 6 characters)',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'USER',
    enum: UserRole,
    description: 'Role of the user',
  })
  @IsEnum(UserRole)
  role: UserRole;
}
