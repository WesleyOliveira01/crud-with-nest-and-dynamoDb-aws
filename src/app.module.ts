import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './config/database/database.service';
import { HashPasswordService } from './config/hashPassword/hashpassword.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';

@Module({
  imports: [],
  controllers: [AppController, UserController],
  providers: [HashPasswordService, DatabaseService, UserService, AppService],
})
export class AppModule {}
