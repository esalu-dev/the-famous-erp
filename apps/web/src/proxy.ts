import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'erp_secret_key';

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === '/login';
  const isPublicAsset =
    pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname === '/favicon.ico';

  if (isPublicAsset) {
    return NextResponse.next();
  }

  let isValid = false;

  if (token) {
    try {
      const secretKey = new TextEncoder().encode(JWT_SECRET);
      await jose.jwtVerify(token, secretKey);
      isValid = true;
    } catch (error) {
      console.warn('Token de sesión inválido o vencido en proxy (middleware):', error);
    }
  }

  // Si no hay token o es inválido/vencido, y no estamos en login, redirigir a login y borrar la cookie
  if (!isValid && !isLoginPage) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    if (token) {
      response.cookies.delete('session_token');
    }
    return response;
  }

  // Si hay token válido e intenta ir al login, redirigir a la aplicación principal (/app)
  if (isValid && isLoginPage) {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
