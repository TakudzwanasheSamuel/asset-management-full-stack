import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const hasSession = request.cookies.has('session'); // Using a simple cookie check for example

  if (hasSession && path === '/login') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  if (!hasSession && path.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
