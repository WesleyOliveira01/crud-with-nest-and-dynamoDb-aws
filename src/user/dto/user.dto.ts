import { CreateUserDto } from "./create-user.dto";

export class UserDto {
  readonly id?: string;
  readonly name: string;
  readonly email: string;
  constructor(user:CreateUserDto) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
  }
}
