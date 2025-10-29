import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip check for admin, API, maintenance, and static assets
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/maintenance') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  try {
    // Same-origin absolute URL
    const url = new URL('/api/settings', request.url);

    // Dev servers typically run without TLS; force http for localhost/LAN
    if (process.env.NODE_ENV !== 'production') {
      const host = request.headers.get('host') || url.host;
      const isLocal =
        host.includes('localhost') ||
        /^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/.test(host);

      if (isLocal) {
        url.protocol = 'http:';
        url.host = host;
      }
    }

    const settingsResponse = await fetch(url.toString(), {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NextJS-Proxy/1.0',
      },
    });

    if (settingsResponse.ok) {
      const settings = await settingsResponse.json();
      if (settings?.maintenanceMode) {
        return NextResponse.redirect(new URL('/maintenance', request.url));
      }
    }
  } catch {
    // Soft-fail: continue without redirect on fetch errors
    // Avoid noisy logs during dev
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};