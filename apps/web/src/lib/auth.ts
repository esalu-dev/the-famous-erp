import { cookies } from 'next/headers';
import * as jose from 'jose';

export interface UserSession {
  id: string;
  email: string;
  rol: 'Admin' | 'Operador';
  nombre: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'erp_secret_key';

export async function getSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
      return null;
    }

    const secretKey = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secretKey);

    return {
      id: payload.sub as string,
      email: payload.email as string,
      rol: payload.rol as 'Admin' | 'Operador',
      nombre: payload.nombre as string,
    };
  } catch (error) {
    if (error instanceof Error && (error as any).digest === 'DYNAMIC_SERVER_USAGE') {
      throw error;
    }
    console.error('Error al verificar el token de sesión:', error);
    return null;
  }
}
