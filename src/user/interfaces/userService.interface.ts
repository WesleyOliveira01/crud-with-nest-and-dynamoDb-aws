import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserDto } from '../dto/user.dto';

export interface UserServiceInterface {
  getUsers(): Promise<UserDto[]>;
  getUserById(id: string): Promise<UserDto>;
  createUser(user: CreateUserDto): Promise<void>;
  updateUser(id:string,user: UpdateUserDto): Promise<void>;
  deleteUser(id: string): Promise<void>;
}
