/**
 * Server-side rate limiting utilities for Next.js Server Actions
 * 
 * This module provides rate limiting specifically for server actions,
 * which don't have access to the standard request/response cycle.
 */

import { headers } from 'next/headers';
import { checkRateLimit, rateLimitConfigs, getClientIP } from './rate-limit';


/**
 * Check if a result is rate limited
 */
export function isRateLimited(result: any): result is { success: false; error: string; rateLimited: true } {
  return result && typeof result === 'object' && result.rateLimited === true;
}
