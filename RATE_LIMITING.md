# 🚦 Rate Limiting Implementation

This document describes the rate limiting system implemented in the Aperture property booking application.

## 📋 Overview

The rate limiting system protects the application from abuse and ensures fair usage by limiting the number of requests from individual IP addresses within specific time windows.

## 🛠️ Architecture

### Components

1. **Rate Limit Utility** (`src/lib/rate-limit.ts`)
   - Core rate limiting logic
   - In-memory storage with automatic cleanup
   - Configurable time windows and request limits

2. **Middleware** (`src/middleware.ts`)
   - Global rate limiting for page requests
   - Runs on all non-static routes

3. **Server Action Wrapper** (`src/lib/rate-limit-server.ts`)
   - Rate limiting for Next.js Server Actions
   - Integrates with existing server actions

4. **Updated Server Actions** (`src/lib/actions.ts`)
   - `bookViewing`: Limited to 5 requests per hour per IP
   - `getCalendarInvite`: Limited to 10 requests per 10 minutes per IP

## ⚙️ Configuration

### Rate Limit Configurations

| Action | Limit | Window | Purpose |
|--------|-------|--------|---------|
| General | 100 requests | 15 minutes | Overall page access |
| Booking | 5 requests | 1 hour | Prevent booking spam |
| Calendar | 10 requests | 10 minutes | Calendar invite generation |
| Strict | 20 requests | 1 hour | Suspicious activity |

### Customization

Edit `src/lib/rate-limit.ts` to modify limits:

```typescript
export const rateLimitConfigs = {
  booking: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5,            // 5 requests max
  },
  // ... other configs
};
```

## 🔧 Usage

### Testing Rate Limits

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test general rate limiting**:
   - Visit `http://localhost:9002/api/test-rate-limit`
   - Refresh rapidly to trigger rate limiting
   - Check response headers for rate limit info

3. **Test booking rate limits**:
   - Navigate to a property page
   - Try to book multiple viewings quickly
   - Rate limit should trigger after 5 attempts per hour

4. **Test calendar rate limits**:
   - Complete a booking
   - Try to download calendar invites repeatedly
   - Rate limit should trigger after 10 attempts per 10 minutes

### Response Headers

All responses include rate limiting headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1703123456
```

### Error Responses

When rate limited, users receive:

```json
{
  "error": "Rate limit exceeded",
  "message": "Rate limit exceeded. Try again in 3456 seconds.",
  "retryAfter": 3456
}
```

## 🔍 Monitoring

### Logging

Rate limit violations are logged:

```typescript
console.warn(`Rate limit exceeded for ${identifier}:`, rateLimitResult.error);
```

### Metrics (Future Enhancement)

Consider adding:
- Request count tracking
- Rate limit hit rates
- IP-based analytics
- Alert system for suspicious activity

## 🚀 Production Considerations

### Scaling

**Current Implementation**: In-memory storage
- ✅ Simple and fast
- ❌ Data lost on server restart
- ❌ Doesn't work with multiple server instances

**Production Alternatives**:

1. **Redis** (Recommended):
   ```bash
   npm install redis
   ```

2. **Database Storage**:
   ```sql
   CREATE TABLE rate_limits (
     id VARCHAR(255) PRIMARY KEY,
     count INT,
     reset_time TIMESTAMP
   );
   ```

3. **External Services**:
   - Cloudflare Rate Limiting
   - AWS API Gateway
   - Nginx rate limiting

### Security Enhancements

1. **IP Detection Improvements**:
   ```typescript
   // Add more header checks
   const trustProxy = true;
   const realIP = trustProxy ? 
     request.headers.get('x-forwarded-for') : 
     request.ip;
   ```

2. **Bypass for Authenticated Users**:
   ```typescript
   // Higher limits for logged-in users
   const isAuthenticated = await checkAuth(request);
   const config = isAuthenticated ? 
     rateLimitConfigs.authenticated : 
     rateLimitConfigs.general;
   ```

3. **Dynamic Rate Limits**:
   ```typescript
   // Adjust limits based on user behavior
   const userRisk = await assessUserRisk(clientIP);
   const config = userRisk === 'high' ? 
     rateLimitConfigs.strict : 
     rateLimitConfigs.general;
   ```

## 🧪 Testing

### Manual Testing

1. **Browser Testing**:
   - Open multiple tabs
   - Refresh rapidly
   - Check Network tab for 429 responses

2. **API Testing**:
   ```bash
   # Test with curl
   for i in {1..25}; do
     curl -I http://localhost:9002/api/test-rate-limit
     sleep 1
   done
   ```

3. **Load Testing**:
   ```bash
   # Install artillery
   npm install -g artillery
   
   # Create test config
   artillery quick --count 50 --num 5 http://localhost:9002/
   ```

### Automated Testing

Consider adding tests for:
- Rate limit enforcement
- Header correctness
- Error message format
- Reset time accuracy

## 🔧 Troubleshooting

### Common Issues

1. **Rate Limits Too Strict**:
   - Increase `maxRequests` in config
   - Decrease `windowMs` for faster reset

2. **Memory Usage**:
   - Monitor `rateLimitStore` size
   - Adjust cleanup interval
   - Consider external storage

3. **IP Detection Issues**:
   - Check proxy configuration
   - Verify header forwarding
   - Test with different clients

### Debugging

Enable debug logging:

```typescript
// Add to rate-limit.ts
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log(`Rate limit check for ${identifier}:`, {
    current: entry?.count || 0,
    limit: config.maxRequests,
    resetTime: new Date(entry?.resetTime || 0),
  });
}
```

## 📚 Further Reading

- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Server Actions Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [Rate Limiting Best Practices](https://blog.logrocket.com/rate-limiting-node-js/)

## 🗑️ Cleanup

**Before Production**:
1. Remove test API route: `src/app/api/test-rate-limit/route.ts`
2. Review and adjust rate limits for production traffic
3. Set up proper monitoring and alerting
4. Consider external rate limiting service

---

## 📝 Configuration Summary

Your current rate limiting setup:

- ✅ **Global rate limiting**: 100 requests per 15 minutes
- ✅ **Booking protection**: 5 bookings per hour
- ✅ **Calendar protection**: 10 invites per 10 minutes
- ✅ **User-friendly error messages**
- ✅ **Proper HTTP status codes and headers**
- ✅ **Automatic cleanup of expired entries**

The system is ready for development and testing. Review the production considerations before deploying to production.
