import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIP, createRateLimitHeaders, rateLimitConfigs } from '@/lib/rate-limit';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip rate limiting for static assets, API routes handled elsewhere, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|css|js|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }
  
  const clientIP = getClientIP(request);
  
  // Apply general rate limiting to all pages
  const rateLimitResult = checkRateLimit(
    `general:${clientIP}`, 
    rateLimitConfigs.general
  );
  
  // Create response with rate limit headers
  const response = rateLimitResult.success 
    ? NextResponse.next()
    : new NextResponse(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: rateLimitResult.error,
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
  
  // Add rate limit headers to all responses
  const headers = createRateLimitHeaders(rateLimitResult, rateLimitConfigs.general);
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - we'll handle these separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
