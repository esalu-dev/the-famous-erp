import { Controller, Post, Req, Body, UseGuards } from '@nestjs/common';
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
}
