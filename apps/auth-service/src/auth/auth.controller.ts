import { Controller, Post, Req, Body, UseGuards, Get, Patch, Delete, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import type { RegisterDto } from './auth-dto';
import { Usuario } from '@the-famous-erp/database-client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  login(@Req() req: { user: Usuario }) {
    return this.authService.login(req.user);
  }

  @Get('/usuarios')
  async getUsuarios() {
    return this.authService.findAll();
  }

  @Post('/usuarios')
  async createUsuario(@Body() body: any) {
    return this.authService.createUsuario(body);
  }

  @Patch('/usuarios/:id')
  async updateUsuario(@Param('id') id: string, @Body() body: any) {
    return this.authService.updateUsuario(id, body);
  }

  @Delete('/usuarios/:id')
  async deleteUsuario(@Param('id') id: string) {
    return this.authService.deleteUsuario(id);
  }
}
