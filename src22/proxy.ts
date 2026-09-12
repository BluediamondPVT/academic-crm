import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROLES } from '@/config/roles';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract authentication cookies
  const token = request.cookies.get('authToken')?.value;
  const userRole = request.cookies.get('userRole')?.value;

  const isAuthPage = pathname.startsWith('/login');

  // 1. Agar login nahi hai aur kisi bhi protected route pe ja raha hai -> Bhej do /login pe
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Agar login hai, aur wapas /login ya root / pe ja raha hai -> Bhej do respective Dashboard pe
  if (token && (isAuthPage || pathname === '/')) {
    if (userRole === ROLES.ADMIN) return NextResponse.redirect(new URL('/admin', request.url));
    if (userRole === ROLES.ACADEMIC) return NextResponse.redirect(new URL('/academic', request.url));
    if (userRole === ROLES.STAFF) return NextResponse.redirect(new URL('/workspace', request.url));
    return NextResponse.redirect(new URL('/counselor', request.url));
  }

  // 3. Strict Role-Based Route Protection
  if (token) {
    // 🔒 COUNSELOR ROLE SECURITY:
    if (userRole === ROLES.COUNSELOR) {
      if (!pathname.startsWith('/counselor') && !pathname.startsWith('/workspace')) {
        return NextResponse.redirect(new URL('/counselor', request.url));
      }
    }

    // 🔒 ACADEMIC ROLE SECURITY:
    if (userRole === ROLES.ACADEMIC) {
      if (pathname === '/admin' || pathname.startsWith('/admin/staff') || pathname.startsWith('/admin/counselors')) {
        return NextResponse.redirect(new URL('/academic', request.url));
      }
      if (pathname === '/counselor') {
        return NextResponse.redirect(new URL('/academic', request.url));
      }
    }

    // 🔒 ADMIN ROLE SECURITY:
    if (userRole === ROLES.ADMIN) {
      if (pathname === '/counselor') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      if (pathname.startsWith('/admin/counselors')) {
        return NextResponse.redirect(new URL('/admin/staff', request.url));
      }
    }

    // 🔒 STAFF ROLE SECURITY:
    if (userRole === ROLES.STAFF) {
      if (!pathname.startsWith('/workspace')) {
        return NextResponse.redirect(new URL('/workspace', request.url));
      }
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Config: Apply proxy to all routes except API, Next.js internal static assets, and favicon
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
