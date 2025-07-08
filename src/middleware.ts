import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/admin/dashboard'];
const authRoute = '/admin/login';
const AUTH_COOKIE_NAME = 'nepali-app-hub-auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !authToken) {
    const url = request.nextUrl.clone();
    url.pathname = authRoute;
    return NextResponse.redirect(url);
  }

  if (pathname === authRoute && authToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
