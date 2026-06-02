'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { config } from '@/lib/config';

export async function loginAction(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Correo y contraseña son requeridos' };
  }

  try {
    const response = await fetch(`${config.services.auth}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correo: email, password }),
    });

    if (!response.ok) {
      // Intentar obtener el mensaje de error del backend
      let errorMessage = 'Error al iniciar sesión';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Si no es JSON, mantenemos el error genérico
      }
      return { error: errorMessage };
    }

    const data = await response.json();
    const token = data.access_token;

    if (!token) {
      return { error: 'No se recibió un token válido del servidor' };
    }

    const cookieStore = await cookies();
    cookieStore.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 día
    });

    return { success: true, error: null };
  } catch (error) {
    console.error('Login Action Error:', error);
    return { error: 'No se pudo conectar con el servicio de autenticación' };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('session_token');
  redirect('/login');
}
