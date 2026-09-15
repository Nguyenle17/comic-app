// Next.js 16 proxy (replaces middleware.ts)
// IMPORTANT: Export named function `proxy`, NOT default export
// Runtime: Node.js (default, do NOT set edge)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Protected routes that require authentication
  const protectedPaths = ['/tai-khoan', '/vi-cua-toi', '/tu-truyen', '/lich-su', '/thong-bao'];
  const authorPaths = ['/tac-gia/truyen-cua-toi', '/tac-gia/tao-truyen', '/tac-gia/sua-truyen', '/tac-gia/quan-ly-chuong', '/tac-gia/soan-chuong'];
  const adminPaths = ['/admin'];
  
  const { pathname } = request.nextUrl;
  
  // Check auth token from cookie
  const token = request.cookies.get('auth-token')?.value;
  const userRole = request.cookies.get('user-role')?.value;
  
  // Check if path is protected
  const isProtected = protectedPaths.some(p => pathname.startsWith(p));
  const isAuthorRoute = authorPaths.some(p => pathname.startsWith(p));
  const isAdminRoute = adminPaths.some(p => pathname.startsWith(p));
  
  if ((isProtected || isAuthorRoute || isAdminRoute) && !token) {
    const loginUrl = new URL('/dang-nhap', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  if (isAuthorRoute && userRole && !['author', 'admin'].includes(userRole)) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  if (isAdminRoute && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/tai-khoan/:path*',
    '/vi-cua-toi/:path*',
    '/tu-truyen/:path*',
    '/lich-su/:path*',
    '/thong-bao/:path*',
    '/tac-gia/:path*',
    '/admin/:path*',
  ],
};
