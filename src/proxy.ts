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
    // Force HTTP for internal requests to avoid SSL issues
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? `https://${request.nextUrl.host}` 
      : `http://localhost:${process.env.PORT || 3000}`;
    
    const settingsResponse = await fetch(`${baseUrl}/api/settings`, {
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
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};