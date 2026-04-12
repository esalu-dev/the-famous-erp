import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'service',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health-db')
  healthDb() {
    return this.appService.dbHealth();
  }
}
