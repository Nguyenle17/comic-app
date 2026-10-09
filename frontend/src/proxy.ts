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
  
  // The refresh token is HttpOnly and is only used as a presence signal here.
  // Authorization is enforced by the backend using the access token.
  const hasRefreshToken = Boolean(
    request.cookies.get('refresh_token')?.value
  );
  
  // Check if path is protected
  const isProtected = protectedPaths.some(p => pathname.startsWith(p));
  const isAuthorRoute = authorPaths.some(p => pathname.startsWith(p));
  const isAdminRoute = adminPaths.some(p => pathname.startsWith(p));
  
  if ((isProtected || isAuthorRoute || isAdminRoute) && !hasRefreshToken) {
    const loginUrl = new URL('/dang-nhap', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
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
