import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../service/user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    description: 'Payload to create a new user',
    type: CreateUserDto,
    examples: {
      example1: {
        summary: 'Valid user data',
        value: {
          name: 'Rakesh Jain',
          email: 'rakesh@example.com',
          age: 30,
          password: 'SecurePass@123',
          role: 'USER',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      example: {
        id: 'user-uuid',
        name: 'Rakesh Jain',
        email: 'rakesh@example.com',
        age: 30,
        role: 'USER',
        createdAt: '2025-06-18T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed or email already exists',
  })
  @Post('register')
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Get a user by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a user by ID' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete a user by ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
