import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const sessionCookie = request.cookies.get('session');

  // If the user is trying to access the login page
  if (path === '/login') {
    // If they have a valid session token, redirect to dashboard
    if (sessionCookie) {
      try {
        await jwtVerify(sessionCookie.value, JWT_SECRET);
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } catch (error) {
        // Invalid token, allow them to access the login page, but clear the cookie
        const response = NextResponse.next();
        response.cookies.delete('session');
        return response;
      }
    }
    return NextResponse.next();
  }

  // For all routes under /admin
  if (path.startsWith('/admin')) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verify the JWT
      await jwtVerify(sessionCookie.value, JWT_SECRET);
      // If verification is successful, proceed to the requested page
      return NextResponse.next();
    } catch (error) {
      // If verification fails, redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      // Clear the invalid cookie
      response.cookies.delete('session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
