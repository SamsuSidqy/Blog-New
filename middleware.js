import { NextResponse } from 'next/server';
import { CookieValid } from '@/lib/CookieMidleware';

export async function middleware(request) {
  const token = request.cookies.get('user')?.value;
  const cookieValid = await CookieValid();

  const pathname = request.nextUrl.pathname;

  // Jika user sudah login & akses /login → redirect ke dashboard
  if (token && cookieValid && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Jika akses ke /dashboard tapi belum login / cookie tidak valid → redirect ke login
  if (pathname.startsWith('/dashboard') && (!token || !cookieValid)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Semua kondisi lain → lanjutkan
  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/dashboard/:path*'], // ✅ tambahkan /login agar bisa dicegat
};
