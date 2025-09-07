/**
 * Server-side rate limiting utilities for Next.js Server Actions
 * 
 * This module provides rate limiting specifically for server actions,
 * which don't have access to the standard request/response cycle.
 */

import { headers } from 'next/headers';
import { checkRateLimit, rateLimitConfigs, getClientIP } from './rate-limit';

/**
 * Rate limit wrapper for server actions
 */
export async function withRateLimit<T extends any[], R>(
  action: (...args: T) => Promise<R>,
  config: keyof typeof rateLimitConfigs,
  customIdentifier?: string
) {
  return async (...args: T): Promise<R | { success: false; error: string; rateLimited: true }> => {
    try {
      // Get client IP from headers
      const headersList = headers();
      const forwarded = headersList.get('x-forwarded-for');
      const realIP = headersList.get('x-real-ip');
      const cfIP = headersList.get('cf-connecting-ip');
      
      let clientIP = 'unknown';
      if (forwarded) {
        clientIP = forwarded.split(',')[0].trim();
      } else if (realIP) {
        clientIP = realIP;
      } else if (cfIP) {
        clientIP = cfIP;
      }
      
      // Create identifier for rate limiting
      const identifier = customIdentifier || `${config}:${clientIP}`;
      
      // Check rate limit
      const rateLimitResult = checkRateLimit(identifier, rateLimitConfigs[config]);
      
      if (!rateLimitResult.success) {
        console.warn(`Rate limit exceeded for ${identifier}:`, rateLimitResult.error);
        return {
          success: false,
          error: rateLimitResult.error || 'Rate limit exceeded. Please try again later.',
          rateLimited: true,
        };
      }
      
      // Execute the original action
      return await action(...args);
    } catch (error) {
      console.error('Error in rate-limited server action:', error);
      throw error;
    }
  };
}

/**
 * Rate limit decorator for server actions
 * Usage: const rateLimitedAction = rateLimit(originalAction, 'booking');
 */
export function rateLimit<T extends any[], R>(
  action: (...args: T) => Promise<R>,
  config: keyof typeof rateLimitConfigs,
  customIdentifier?: string
) {
  return withRateLimit(action, config, customIdentifier);
}

/**
 * Check if a result is rate limited
 */
export function isRateLimited(result: any): result is { success: false; error: string; rateLimited: true } {
  return result && typeof result === 'object' && result.rateLimited === true;
}
