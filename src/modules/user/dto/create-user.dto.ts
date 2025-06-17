import { IsEmail, IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(1)
  age: number;
}
