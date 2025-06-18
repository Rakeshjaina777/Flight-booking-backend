import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client'; // ✅ CORRECTED: Import Prisma from @prisma/client

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    try {
      const { name, email, age, role, password } = dto;

      // Check if email already exists
      const existing = await this.prisma.user.findUnique({ where: { email } });
      if (existing) {
        throw new ConflictException('Email already in use');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          age,
          role,
          password: hashedPassword,
        },
      });

      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Unique constraint failed. Email already exists.',
        );
      }

      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException(
          'Validation error. Check input types and required fields.',
        );
      }

      console.error('❌ Error during user creation:', error);
      throw new InternalServerErrorException(
        'User creation failed. Please try again.',
      );
    }
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    // Remove passwords from each user object
    return users.map(({ password, ...u }) => u);
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const { password, ...result } = user;
    return result;
  }

  async update(id: string, dto: UpdateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('User not found');

    let data = { ...dto };

    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    const updated = await this.prisma.user.update({ where: { id }, data });
    const { password, ...result } = updated;
    return result;
  }

  async remove(id: string) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('User not found');
    return this.prisma.user.delete({ where: { id } });
  }
}
