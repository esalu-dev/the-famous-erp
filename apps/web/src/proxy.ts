import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === '/login';
  const isPublicAsset = pathname.startsWith('/_next') || 
                        pathname.startsWith('/api') || 
                        pathname === '/favicon.ico';

  if (isPublicAsset) {
    return NextResponse.next();
  }

  // Si no hay token y no es la página de login, redirigir a login
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si hay token e intenta ir al login, redirigir a la aplicación principal (/app)
  if (token && isLoginPage) {
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
