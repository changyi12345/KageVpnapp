import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
    const url = new URL('/api/settings', request.url);

    if (process.env.NODE_ENV !== 'production') {
      const host = request.headers.get('host') || url.host;
      const isLocal = host.includes('localhost') ||
        /^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/.test(host);
      if (isLocal) {
        url.protocol = 'http:';
        url.host = host;
      }
    }

    const res = await fetch(url.toString(), { cache: 'no-store', headers: { Accept: 'application/json' } });
    if (res.ok) {
      const settings = await res.json();
      if (settings?.maintenanceMode) {
        return NextResponse.redirect(new URL('/maintenance', request.url));
      }
    }
  } catch {
    // soft fail
  }

  return NextResponse.next();
}

export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'] };