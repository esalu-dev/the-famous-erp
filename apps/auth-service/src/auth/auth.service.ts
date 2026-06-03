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
      throw new BadRequestException('¡Ya existe un usuario asociado a este correo, inicia sesión!');
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

  async findAll() {
    const users = await this.prisma.usuario.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
    // Remove password hashes from response
    return users.map(({ passwordHash: _passwordHash, ...user }) => user);
  }

  async createUsuario(data: {
    nombre: string;
    correo: string;
    password?: string;
    rol?: 'Admin' | 'Operador';
    activo?: boolean;
  }) {
    const userExists = await this.prisma.usuario.findUnique({
      where: {
        correo: data.correo,
      },
    });

    if (userExists) {
      throw new BadRequestException('¡Ya existe un usuario asociado a este correo!');
    }

    const password = data.password || '123456';
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.usuario.create({
      data: {
        nombre: data.nombre,
        correo: data.correo,
        passwordHash: hashedPassword,
        rol: data.rol || 'Operador',
        activo: data.activo !== undefined ? data.activo : true,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _passwordHash, ...result } = user;
    return result;
  }

  async updateUsuario(
    id: string,
    data: {
      nombre?: string;
      correo?: string;
      password?: string;
      rol?: 'Admin' | 'Operador';
      activo?: boolean;
    },
  ) {
    const userExists = await this.prisma.usuario.findUnique({
      where: { id },
    });

    if (!userExists) {
      throw new BadRequestException('El usuario no existe.');
    }

    if (data.correo && data.correo !== userExists.correo) {
      const emailTaken = await this.prisma.usuario.findUnique({
        where: { correo: data.correo },
      });
      if (emailTaken) {
        throw new BadRequestException('El correo ya está en uso por otro usuario.');
      }
    }

    const updateData: any = {};
    if (data.nombre !== undefined) updateData.nombre = data.nombre;
    if (data.correo !== undefined) updateData.correo = data.correo;
    if (data.rol !== undefined) updateData.rol = data.rol;
    if (data.activo !== undefined) updateData.activo = data.activo;

    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await this.prisma.usuario.update({
      where: { id },
      data: updateData,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _passwordHash, ...result } = updatedUser;
    return result;
  }

  async deleteUsuario(id: string) {
    const userExists = await this.prisma.usuario.findUnique({
      where: { id },
    });

    if (!userExists) {
      throw new BadRequestException('El usuario no existe.');
    }

    await this.prisma.usuario.delete({
      where: { id },
    });

    return { message: 'Usuario eliminado exitosamente' };
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
      nombre: user.nombre,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
