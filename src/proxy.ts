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
    // Build same-origin absolute URL
    const url = new URL('/api/settings', request.url);

    // In development, if origin is https (behind proxy), force http for local/server that lacks TLS
    if (process.env.NODE_ENV !== 'production') {
      const host = request.headers.get('host') || url.host;
      const isLocal =
        host.includes('localhost') ||
        /^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/.test(host); // IPv4 with optional port

      if (isLocal) {
        url.protocol = 'http:';
        url.host = host; // keep original host:port
      }
    }

    const settingsResponse = await fetch(url.toString(), {
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
    // Avoid noisy logs in dev; continue without the maintenance check
    console.warn('Proxy maintenance check skipped due to fetch error.');
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};