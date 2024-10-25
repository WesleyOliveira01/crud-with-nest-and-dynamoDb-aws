import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { String } from 'aws-sdk/clients/cloudsearchdomain';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

interface Response<T> {
  message: string;
  data: T;
  status?: number;
}

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(): Promise<Response<UserDto[]>> {
    const user = await this.userService.getUsers();
    return {
      message: 'Users found',
      data: user,
      status: 200,
    };
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Response<UserDto>> {
    const user = await this.userService.getUserById(id);
    return {
      message: 'User found',
      data: user,
      status: 200,
    };
  }

  @Post()
  async create(@Body() user: CreateUserDto): Promise<Response<void>> {
    await this.userService.createUser(user);
    return {
      message: 'User created',
      status: 201,
      data: null,
    };
  }
  @Put(':id')
  async update(
    @Param('id') id: String,
    @Body() user: UpdateUserDto,
  ): Promise<Response<void>> {
    try {
      await this.userService.updateUser(id, user);
      return {
        message: 'User updated',
        status: 200,
        data: null,
      };
    } catch (e) {
      return {
        message: e.message,
        status: 400,
        data: null,
      };
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Response<void>> {
    await this.userService.deleteUser(id);
    return {
      message: 'User deleted',
      status: 200,
      data: null,
    };
  }
}
