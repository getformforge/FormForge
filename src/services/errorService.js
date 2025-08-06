// Centralized error handling service
// Sanitizes error messages to prevent information disclosure

class ErrorService {
  constructor() {
    this.isDevelopment = import.meta.env.MODE === 'development';
    
    // Generic error messages for production
    this.genericMessages = {
      auth: 'Authentication failed. Please check your credentials and try again.',
      network: 'Network error. Please check your connection and try again.',
      permission: 'You do not have permission to perform this action.',
      validation: 'Please check your input and try again.',
      server: 'Something went wrong. Please try again later.',
      notFound: 'The requested resource was not found.',
      rateLimit: 'Too many requests. Please wait before trying again.',
      payment: 'Payment processing error. Please try again or contact support.',
      storage: 'Storage error. Please try again.',
      unknown: 'An unexpected error occurred. Please try again.'
    };

    // Firebase error code mappings
    this.firebaseErrorMap = {
      'auth/email-already-in-use': 'This email is already registered. Please sign in or use a different email.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/operation-not-allowed': 'This operation is not allowed. Please contact support.',
      'auth/weak-password': 'Please choose a stronger password (at least 6 characters).',
      'auth/user-disabled': 'This account has been disabled. Please contact support.',
      'auth/user-not-found': 'No account found with this email. Please sign up first.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/too-many-requests': 'Too many failed attempts. Please wait before trying again.',
      'auth/requires-recent-login': 'Please sign in again to continue.',
      
      // Firestore errors
      'permission-denied': 'You do not have permission to perform this action.',
      'not-found': 'The requested data was not found.',
      'already-exists': 'This resource already exists.',
      'resource-exhausted': 'Quota exceeded. Please try again later.',
      'failed-precondition': 'Operation failed. Please try again.',
      'aborted': 'Operation was cancelled.',
      'out-of-range': 'Operation is out of valid range.',
      'unimplemented': 'This feature is not yet available.',
      'internal': 'Internal error. Please try again.',
      'unavailable': 'Service temporarily unavailable. Please try again.',
      'data-loss': 'Data error. Please contact support.',
      'unauthenticated': 'Please sign in to continue.'
    };
  }

  // Main error handling method
  handle(error, context = 'general') {
    // Log full error in development
    if (this.isDevelopment) {
      console.error(`[${context}] Error:`, error);
    } else {
      // In production, log sanitized version
      console.error(`[${context}] Error occurred`);
    }

    // Get user-friendly message
    const message = this.getMessage(error);
    
    // Return sanitized error object
    return {
      message,
      context,
      timestamp: new Date().toISOString(),
      // Only include details in development
      ...(this.isDevelopment && { 
        originalError: error.message || error,
        stack: error.stack 
      })
    };
  }

  // Get appropriate error message
  getMessage(error) {
    // Check if it's a Firebase error
    if (error.code) {
      const firebaseMessage = this.firebaseErrorMap[error.code];
      if (firebaseMessage) {
        return firebaseMessage;
      }
    }

    // Check for network errors
    if (error.message && error.message.toLowerCase().includes('network')) {
      return this.genericMessages.network;
    }

    // Check for permission errors
    if (error.message && (
      error.message.toLowerCase().includes('permission') ||
      error.message.toLowerCase().includes('unauthorized') ||
      error.message.toLowerCase().includes('forbidden')
    )) {
      return this.genericMessages.permission;
    }

    // Check for validation errors
    if (error.message && (
      error.message.toLowerCase().includes('invalid') ||
      error.message.toLowerCase().includes('validation')
    )) {
      return this.genericMessages.validation;
    }

    // Check for rate limit errors
    if (error.message && (
      error.message.toLowerCase().includes('rate limit') ||
      error.message.toLowerCase().includes('too many')
    )) {
      return this.genericMessages.rateLimit;
    }

    // Check for payment errors
    if (error.message && (
      error.message.toLowerCase().includes('payment') ||
      error.message.toLowerCase().includes('stripe') ||
      error.message.toLowerCase().includes('billing')
    )) {
      return this.genericMessages.payment;
    }

    // In development, return the actual error message
    if (this.isDevelopment && error.message) {
      return error.message;
    }

    // Default to generic message
    return this.genericMessages.unknown;
  }

  // Handle and display error to user
  displayError(error, context = 'general') {
    const errorInfo = this.handle(error, context);
    
    // You can customize how errors are displayed
    // For now, using alert, but could integrate with a toast library
    alert(`❌ ${errorInfo.message}`);
    
    return errorInfo;
  }

  // Handle async operations with error handling
  async handleAsync(asyncFn, context = 'general') {
    try {
      return await asyncFn();
    } catch (error) {
      const errorInfo = this.handle(error, context);
      throw new Error(errorInfo.message);
    }
  }

  // Create a safe error response for API calls
  createErrorResponse(error, statusCode = 500) {
    const errorInfo = this.handle(error);
    
    return {
      success: false,
      error: errorInfo.message,
      statusCode,
      timestamp: errorInfo.timestamp,
      ...(this.isDevelopment && { debug: errorInfo })
    };
  }

  // Log error to external service (placeholder for future implementation)
  async logToService(error, context, userId = null) {
    // In production, you would send this to a service like Sentry
    const errorInfo = {
      message: error.message || error,
      stack: error.stack,
      context,
      userId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // TODO: Implement actual logging service integration
    if (this.isDevelopment) {
      console.log('Would log to service:', errorInfo);
    }
  }
}

// Export singleton instance
const errorService = new ErrorService();
export default errorService;