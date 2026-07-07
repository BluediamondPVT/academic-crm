import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Cookies se data nikalna
  const token = request.cookies.get('authToken')?.value;
  const userRole = request.cookies.get('userRole')?.value;

  const isAuthPage = pathname.startsWith('/login');

  // 1. Agar login nahi hai aur protected page pe ja raha hai -> Bhej do Login pe
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Agar login hai, aur wapas /login pe ja raha hai -> Bhej do Dashboard pe
  if (token && isAuthPage) {
    if (userRole === 'ADMIN') return NextResponse.redirect(new URL('/admin', request.url));
    return NextResponse.redirect(new URL('/counselor', request.url));
  }

  // 3. Role Checking Protection
  if (token) {
    // Agar Counselor Admin ke page pe jaane ki koshish kare
    if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/counselor', request.url)); 
    }
    
    // Agar Admin Counselor ke page pe aaye
    if (pathname.startsWith('/counselor') && userRole === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url)); 
    }
  }

  return NextResponse.next();
}

// Config ki kin routes pe middleware chalana hai (API aur static files ko chhod ke sab pe)
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};