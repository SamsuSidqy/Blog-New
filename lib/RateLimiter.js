import { RateLimiterMemory } from 'rate-limiter-flexible';

// Setup the rate limiter
const rateLimiter = new RateLimiterMemory({
  points: 10,       // Number of requests
  duration: 60,    // Per 60 seconds per IP
});

export default rateLimiter