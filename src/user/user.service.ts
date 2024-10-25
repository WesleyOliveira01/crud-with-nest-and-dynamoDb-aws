import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/config/database/database.service';
import { HashPasswordService } from 'src/config/hashPassword/hashpassword.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UserServiceInterface } from './interfaces/userService.interface';

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly hashPasswordService: HashPasswordService,
  ) {}

  async getUsers(): Promise<UserDto[]> {
    const params: AWS.DynamoDB.ScanInput = {
      TableName: 'Users',
    };
    const data = await this.databaseService.getItems(params);
    if (data.Items === null) throw new Error('No users found');
    return data.Items.map((item) => {
      return new UserDto({
        id: item.id.S,
        name: item.name.S,
        email: item.email.S,
      });
    });
  }
  async getUserById(id: string): Promise<UserDto> {
    if (id === undefined) throw new Error('No user id provided');
    const params: AWS.DynamoDB.GetItemInput = {
      TableName: 'Users',
      Key: {
        id: { S: id },
      },
    };
    const data = await this.databaseService.getItem(params);
    if (data.Item === null) throw new Error('No user found');
    return new UserDto({
      id: data.Item.id.S,
      name: data.Item.name.S,
      email: data.Item.email.S,
    });
  }
  async createUser(user: CreateUserDto): Promise<void> {
    if (user.name === undefined || user.email === undefined)
      throw new Error('No user name or email provided');
    const hashPassword = await this.hashPasswordService.hashPassword(
      user.password,
    );
    const params: AWS.DynamoDB.PutItemInput = {
      TableName: 'Users',
      Item: {
        id: { S: crypto.randomUUID() },
        name: { S: user.name },
        email: { S: user.email },
        password: { S: hashPassword.toString() },
      },
    };
    await this.databaseService.createItem(params);
  }
  async updateUser(id: string, user: UpdateUserDto): Promise<void> {
    if (
      user.name === undefined ||
      user.email === undefined ||
      user.password === undefined
    )
      throw new Error('No user name,email or password provided');
    const hashPassword = await this.hashPasswordService.hashPassword(
      user.password,
    );
    const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: 'Users',
      Key: {
        id: { S: id },
      },
      UpdateExpression:
        'SET #name = :name, #email = :email, #password = :password',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#email': 'email',
        '#password': 'password',
      },
      ExpressionAttributeValues: {
        ':name': { S: user.name },
        ':email': { S: user.email },
        ':password': { S: hashPassword },
      },
    };
    await this.databaseService.updateItem(params);
  }
  async deleteUser(id: string): Promise<void> {
    if (id === undefined) throw new Error('No user id provided');
    const params: AWS.DynamoDB.GetItemInput = {
      TableName: 'Users',
      Key: {
        id: { S: id },
      },
    };
    const user = await this.databaseService.getItem(params);
    if (user.Item === null) throw new Error('No user found');
    await this.databaseService.deleteItem(params);
  }
}
