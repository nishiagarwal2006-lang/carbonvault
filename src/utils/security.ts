/**
 * Security utilities for input sanitization and validation
 * Protects against XSS, injection attacks, and abuse
 */

/**
 * Sanitizes HTML string to prevent XSS attacks
 * @param html - HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHTML(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Escapes special characters in a string for safe HTML rendering
 * @param str - String to escape
 * @returns Escaped string
 */
export function escapeHTML(str: string): string {
  const htmlEscapeMap: Record<string, string> = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return str.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char]);
}

/**
 * Validates and sanitizes email input
 * @param email - Email to validate
 * @returns Sanitized email or null if invalid
 */
export function sanitizeEmail(email: string): string | null {
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  
  if (!emailRegex.test(trimmed)) {
    return null;
  }
  
  // Additional check for common malicious patterns
  if (trimmed.includes('..') || trimmed.startsWith('.') || trimmed.endsWith('.')) {
    return null;
  }
  
  return trimmed;
}

/**
 * Sanitizes numeric input to prevent injection
 * @param value - Value to sanitize
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Sanitized number or null if invalid
 */
export function sanitizeNumber(
  value: any,
  min: number = -Infinity,
  max: number = Infinity
): number | null {
  const num = Number(value);
  
  if (isNaN(num) || !isFinite(num)) {
    return null;
  }
  
  if (num < min || num > max) {
    return null;
  }
  
  return num;
}

/**
 * Sanitizes string input by removing potentially dangerous characters
 * @param str - String to sanitize
 * @param maxLength - Maximum allowed length
 * @returns Sanitized string
 */
export function sanitizeString(str: string, maxLength: number = 1000): string {
  if (typeof str !== 'string') {
    return '';
  }
  
  // Remove null bytes and control characters
  let sanitized = str.replace(/[\x00-\x1F\x7F]/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Rate limiter class to prevent abuse
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private limit: number;
  private window: number;
  
  /**
   * Creates a rate limiter
   * @param limit - Maximum number of requests allowed
   * @param window - Time window in milliseconds
   */
  constructor(limit: number, window: number) {
    this.limit = limit;
    this.window = window;
  }
  
  /**
   * Checks if a request is allowed
   * @param key - Unique identifier for the requester
   * @returns True if request is allowed, false otherwise
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const timestamps = this.requests.get(key) || [];
    
    // Remove old timestamps outside the window
    const validTimestamps = timestamps.filter(
      (timestamp) => now - timestamp < this.window
    );
    
    if (validTimestamps.length >= this.limit) {
      return false;
    }
    
    validTimestamps.push(now);
    this.requests.set(key, validTimestamps);
    
    return true;
  }
  
  /**
   * Resets the rate limiter for a specific key
   * @param key - Unique identifier to reset
   */
  reset(key: string): void {
    this.requests.delete(key);
  }
  
  /**
   * Clears all rate limit data
   */
  clear(): void {
    this.requests.clear();
  }
}

/**
 * Validates URL to prevent open redirect vulnerabilities
 * @param url - URL to validate
 * @param allowedDomains - List of allowed domains
 * @returns True if URL is safe, false otherwise
 */
export function isValidURL(url: string, allowedDomains?: string[]): boolean {
  try {
    const parsed = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }
    
    // Check against allowed domains if provided
    if (allowedDomains && allowedDomains.length > 0) {
      return allowedDomains.some((domain) => 
        parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
      );
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Generates a secure random token
 * @param length - Length of the token
 * @returns Random token string
 */
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validates file upload to prevent malicious files
 * @param file - File to validate
 * @param allowedTypes - Allowed MIME types
 * @param maxSize - Maximum file size in bytes
 * @returns True if file is valid, false otherwise
 */
export function validateFileUpload(
  file: File,
  allowedTypes: string[],
  maxSize: number
): boolean {
  // Check file size
  if (file.size > maxSize) {
    return false;
  }
  
  // Check MIME type
  if (!allowedTypes.includes(file.type)) {
    return false;
  }
  
  // Check file extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  const allowedExtensions = allowedTypes.map((type) => type.split('/')[1]);
  
  if (!extension || !allowedExtensions.includes(extension)) {
    return false;
  }
  
  return true;
}

/**
 * Content Security Policy helper
 * @returns CSP meta tag content
 */
export function getCSPContent(): string {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com",
    "frame-src 'self' https://accounts.google.com",
  ].join('; ');
}

// Made with Bob
