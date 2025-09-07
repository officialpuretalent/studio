/**
 * Test API route to verify rate limiting functionality
 * 
 * This endpoint can be used to test the rate limiting implementation
 * without affecting the main application functionality.
 * 
 * Usage: GET /api/test-rate-limit
 * 
 * Remove this file in production!
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIP, createRateLimitHeaders, rateLimitConfigs } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  const clientIP = getClientIP(request);
  
  // Test with strict rate limiting (20 requests per hour)
  const rateLimitResult = checkRateLimit(
    `test:${clientIP}`,
    rateLimitConfigs.strict
  );
  
  if (!rateLimitResult.success) {
    const headers = createRateLimitHeaders(rateLimitResult, rateLimitConfigs.strict);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Rate limit exceeded',
        error: rateLimitResult.error,
        clientIP,
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          ...headers,
          'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
        },
      }
    );
  }
  
  const headers = createRateLimitHeaders(rateLimitResult, rateLimitConfigs.strict);
  
  return NextResponse.json(
    {
      success: true,
      message: 'Request successful',
      clientIP,
      remaining: rateLimitResult.remaining,
      resetTime: new Date(rateLimitResult.resetTime).toISOString(),
    },
    {
      headers,
    }
  );
}
