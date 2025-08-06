// Rate limiting service to prevent abuse
// Uses localStorage for client-side rate limiting (not foolproof but adds a layer of protection)
// Should be combined with server-side rate limiting in production

class RateLimitService {
  constructor() {
    this.limits = {
      pdf_generation: {
        maxAttempts: 10,
        windowMs: 60 * 60 * 1000, // 1 hour
        message: 'Too many PDF generation attempts. Please wait before trying again.'
      },
      form_submission: {
        maxAttempts: 20,
        windowMs: 15 * 60 * 1000, // 15 minutes
        message: 'Too many form submissions. Please wait before submitting again.'
      },
      form_creation: {
        maxAttempts: 5,
        windowMs: 60 * 60 * 1000, // 1 hour
        message: 'Too many forms created. Please wait before creating another form.'
      },
      authentication: {
        maxAttempts: 5,
        windowMs: 15 * 60 * 1000, // 15 minutes
        message: 'Too many login attempts. Please wait before trying again.'
      }
    };
  }

  // Generate a key for storing rate limit data
  getKey(action, identifier = 'global') {
    return `rateLimit_${action}_${identifier}`;
  }

  // Clean up old rate limit entries
  cleanOldEntries(entries, windowMs) {
    const now = Date.now();
    return entries.filter(timestamp => now - timestamp < windowMs);
  }

  // Check if an action is rate limited
  isRateLimited(action, identifier = 'global') {
    const limit = this.limits[action];
    if (!limit) return false;

    const key = this.getKey(action, identifier);
    const storedData = localStorage.getItem(key);
    
    if (!storedData) return false;

    try {
      const entries = JSON.parse(storedData);
      const validEntries = this.cleanOldEntries(entries, limit.windowMs);
      
      // Update storage with cleaned entries
      if (validEntries.length !== entries.length) {
        localStorage.setItem(key, JSON.stringify(validEntries));
      }

      return validEntries.length >= limit.maxAttempts;
    } catch (error) {
      // If data is corrupted, reset it
      localStorage.removeItem(key);
      return false;
    }
  }

  // Record an attempt for rate limiting
  recordAttempt(action, identifier = 'global') {
    const limit = this.limits[action];
    if (!limit) return true;

    const key = this.getKey(action, identifier);
    const now = Date.now();
    
    try {
      const storedData = localStorage.getItem(key);
      let entries = storedData ? JSON.parse(storedData) : [];
      
      // Clean old entries
      entries = this.cleanOldEntries(entries, limit.windowMs);
      
      // Check if limit would be exceeded
      if (entries.length >= limit.maxAttempts) {
        return false;
      }
      
      // Add new entry
      entries.push(now);
      localStorage.setItem(key, JSON.stringify(entries));
      
      return true;
    } catch (error) {
      console.error('Error recording rate limit attempt:', error);
      return true; // Allow on error to not block legitimate users
    }
  }

  // Check and record in one operation
  checkAndRecord(action, identifier = 'global') {
    if (this.isRateLimited(action, identifier)) {
      return {
        allowed: false,
        message: this.limits[action]?.message || 'Rate limit exceeded. Please try again later.'
      };
    }

    const recorded = this.recordAttempt(action, identifier);
    return {
      allowed: recorded,
      message: recorded ? null : (this.limits[action]?.message || 'Rate limit exceeded. Please try again later.')
    };
  }

  // Get remaining attempts
  getRemainingAttempts(action, identifier = 'global') {
    const limit = this.limits[action];
    if (!limit) return null;

    const key = this.getKey(action, identifier);
    const storedData = localStorage.getItem(key);
    
    if (!storedData) return limit.maxAttempts;

    try {
      const entries = JSON.parse(storedData);
      const validEntries = this.cleanOldEntries(entries, limit.windowMs);
      return Math.max(0, limit.maxAttempts - validEntries.length);
    } catch (error) {
      return limit.maxAttempts;
    }
  }

  // Get time until reset (in milliseconds)
  getTimeUntilReset(action, identifier = 'global') {
    const limit = this.limits[action];
    if (!limit) return null;

    const key = this.getKey(action, identifier);
    const storedData = localStorage.getItem(key);
    
    if (!storedData) return 0;

    try {
      const entries = JSON.parse(storedData);
      if (entries.length === 0) return 0;
      
      const oldestEntry = Math.min(...entries);
      const resetTime = oldestEntry + limit.windowMs;
      const now = Date.now();
      
      return Math.max(0, resetTime - now);
    } catch (error) {
      return 0;
    }
  }

  // Format time for display
  formatTimeRemaining(milliseconds) {
    if (milliseconds <= 0) return 'now';
    
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return `${seconds} second${seconds > 1 ? 's' : ''}`;
    }
  }

  // Clear rate limit for testing/debugging
  clearRateLimit(action, identifier = 'global') {
    const key = this.getKey(action, identifier);
    localStorage.removeItem(key);
  }

  // Clear all rate limits
  clearAllRateLimits() {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('rateLimit_'));
    keys.forEach(key => localStorage.removeItem(key));
  }
}

// Export singleton instance
const rateLimitService = new RateLimitService();
export default rateLimitService;