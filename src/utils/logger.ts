/**
 * Logger utility with support for development/production modes
 * Uses __DEV__ flag to enable/disable logging in production
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private enabled: boolean;

  constructor() {
    // Enable logging in development mode, disable in production
    this.enabled = __DEV__;
  }

  /**
   * Log a message (only in development)
   */
  log(...args: any[]): void {
    if (this.enabled) {
      console.log(...args);
    }
  }

  /**
   * Log info message (only in development)
   */
  info(...args: any[]): void {
    if (this.enabled) {
      console.info(...args);
    }
  }

  /**
   * Log warning message (always logs, as warnings are important)
   */
  warn(...args: any[]): void {
    console.warn(...args);
  }

  /**
   * Log error message (always logs, as errors must be tracked)
   */
  error(...args: any[]): void {
    console.error(...args);
  }

  /**
   * Log debug message (only in development)
   */
  debug(...args: any[]): void {
    if (this.enabled) {
      console.debug(...args);
    }
  }

  /**
   * Enable or disable logging programmatically
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Check if logging is currently enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }
}

// Export singleton instance
export const logger = new Logger();
