import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TempDatabaseService } from './services/db.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dbService: TempDatabaseService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
