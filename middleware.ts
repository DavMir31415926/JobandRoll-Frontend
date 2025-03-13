import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n/request';

// Create the middleware for handling localized routes
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true
});

// Export a middleware function that lets API routes pass through completely
export default function middleware(request: NextRequest) {
  // Skip middleware for API routes completely
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  // Otherwise, apply the intl middleware
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for specific files/folders
  matcher: ['/((?!_next|_vercel|.*\\..*).*)']
};