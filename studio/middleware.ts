import { NextRequest, NextResponse } from 'next/server';

// Paths that require authentication
const protectedPaths = ['/dashboard', '/settings', '/api/webhooks'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if path requires authentication
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // Check for Supabase auth cookie
  // Note: In a real app, you'd verify the JWT token here
  // For now, we rely on the client-side auth context
  // The middleware is mainly for route structure documentation

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
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
