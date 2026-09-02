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
    return NextResponse.redirect(new URL('/counselor', request.url));
  }

  // 3. Strict Role-Based Route Protection
  if (token) {
    // 🔒 COUNSELOR ROLE SECURITY:
    // Counselor sirf aur sirf '/counselor' se shuru hone wale URLs pe ja sakta hai (Dashboard, Leads, Create, Edit, View)
    // Agar Counselor /admissions, /admin, /academic ya koi bhi aur URL hit kare -> Redirect to /counselor
    if (userRole === ROLES.COUNSELOR) {
      if (!pathname.startsWith('/counselor')) {
        return NextResponse.redirect(new URL('/counselor', request.url));
      }
    }

    // 🔒 ACADEMIC ROLE SECURITY:
    // Academic team Dashboard (/academic), Admissions (/admissions), Universities (/admin/universities), 
    // Leads (/admin/students), aur lead view/create/edit access kar sakti hai.
    // Lekin Staff Management (/admin/counselors), Admin Home (/admin), aur Counselor Dashboard (/counselor) prohibited hain.
    if (userRole === ROLES.ACADEMIC) {
      // Prohibit Admin Home & Staff Management
      if (pathname === '/admin' || pathname.startsWith('/admin/counselors')) {
        return NextResponse.redirect(new URL('/academic', request.url));
      }
      // Prohibit Counselor base Dashboard
      if (pathname === '/counselor') {
        return NextResponse.redirect(new URL('/academic', request.url));
      }
    }

    // 🔒 ADMIN ROLE SECURITY:
    // Admin ko full system access hai. Agar Admin /counselor base dashboard hit kare -> Redirect to /admin
    if (userRole === ROLES.ADMIN) {
      if (pathname === '/counselor') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }
  }

  return NextResponse.next();
}

// Config: Apply proxy to all routes except API, Next.js internal static assets, and favicon
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

