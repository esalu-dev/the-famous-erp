import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Usuario } from '@the-famous-erp/database-client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(data: { nombre: string; correo: string; password: string }) {
    const userExists = await this.prisma.usuario.findUnique({
      where: {
        correo: data.correo,
      },
    });

    if (userExists) {
      throw new BadRequestException(
        '¡Ya existe un usuario asociado a este correo, inicia sesión!',
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.usuario.create({
      data: {
        nombre: data.nombre,
        correo: data.correo,
        passwordHash: hashedPassword,
      },
    });

    return { message: '¡Usuario registrado exitosamente!', userId: user.id };
  }

  async validateUser(correo: string, password: string) {
    const user = await this.prisma.usuario.findUnique({
      where: { correo: correo },
    });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash: _passwordHash, ...result } = user;

      return result;
    }
    return null;
  }

  login(user: Usuario) {
    const payload = {
      sub: user.id,
      email: user.correo,
      rol: user.rol,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
