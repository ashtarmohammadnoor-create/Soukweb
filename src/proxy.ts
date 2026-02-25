import {NextRequest, NextResponse} from 'next/server';
import createMiddleware from 'next-intl/middleware';
import {jwtVerify} from 'jose';
import {routing} from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);
const SESSION_COOKIE = 'webshop_session';
const encoder = new TextEncoder();

async function getPayload(token: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    return null;
  }

  try {
    const {payload} = await jwtVerify(token, encoder.encode(secret));
    return payload as {role?: string};
  } catch {
    return null;
  }
}

function extractLocale(pathname: string) {
  const segment = pathname.split('/').filter(Boolean)[0];
  return routing.locales.includes(segment as 'en' | 'ar') ? segment : null;
}

function localeFromAcceptLanguage(header: string | null) {
  if (!header) {
    return null;
  }
  const first = header.split(',')[0]?.toLowerCase();
  if (!first) {
    return null;
  }
  if (first.startsWith('ar')) {
    return 'ar';
  }
  if (first.startsWith('en')) {
    return 'en';
  }
  return null;
}

function localizedPath(locale: string, path: string) {
  return `/${locale}${path}`;
}

export async function proxy(request: NextRequest) {
  const locale =
    extractLocale(request.nextUrl.pathname) ??
    (request.cookies.get('NEXT_LOCALE')?.value === 'ar' ? 'ar' : request.cookies.get('NEXT_LOCALE')?.value === 'en' ? 'en' : null) ??
    localeFromAcceptLanguage(request.headers.get('accept-language')) ??
    routing.defaultLocale;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const pathnameWithoutLocale = request.nextUrl.pathname.replace(new RegExp(`^/${locale}`), '') || '/';

  const isProtected =
    pathnameWithoutLocale.startsWith('/admin') ||
    pathnameWithoutLocale.startsWith('/account') ||
    pathnameWithoutLocale.startsWith('/checkout');

  if (isProtected && !token) {
    return NextResponse.redirect(new URL(localizedPath(locale, '/login'), request.url));
  }

  if (token) {
    const payload = await getPayload(token);
    if (!payload) {
      const response = NextResponse.redirect(new URL(localizedPath(locale, '/login'), request.url));
      response.cookies.delete(SESSION_COOKIE);
      return response;
    }

    if (pathnameWithoutLocale.startsWith('/admin') && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL(localizedPath(locale, '/'), request.url));
    }
  }

  const response = intlMiddleware(request);
  response.headers.set('x-locale', locale);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
