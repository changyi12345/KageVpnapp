import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip maintenance check for admin routes, API routes, and maintenance page itself
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/maintenance') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  try {
    // Use the incoming request origin to avoid SSL mismatch
    const baseUrl = request.nextUrl.origin;

    const settingsResponse = await fetch(`${baseUrl}/api/settings`, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'NextJS-Middleware/1.0',
        'Accept': 'application/json',
      },
    });

    if (settingsResponse.ok) {
      const settings = await settingsResponse.json();
      if (settings.maintenanceMode) {
        return NextResponse.redirect(new URL('/maintenance', request.url));
      }
    }
  } catch (error) {
    console.error('Proxy error checking maintenance mode:', error);
    // Continue without maintenance check if there's an error
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};