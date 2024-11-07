import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TempDatabaseService } from './services/db.service';
import { UserController } from './controllers/usersController';

@Module({
  imports: [],
  controllers: [AppController, UserController],
  providers: [AppService, TempDatabaseService],
})
export class AppModule {}
