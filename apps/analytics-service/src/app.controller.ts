import { Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('analiticas')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('calcular-abc')
  async calcularABC() {
    return await this.appService.calcularClasificacionABC();
  }
}