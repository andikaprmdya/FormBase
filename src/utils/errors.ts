/**
 * Custom error types for better error handling and type safety
 */

/**
 * Base application error class
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Network-related errors (fetch failures, timeouts, etc.)
 */
export class NetworkError extends AppError {
  constructor(message: string = 'Network error. Please check your internet connection.', statusCode?: number) {
    super(message, 'NETWORK_ERROR', statusCode);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * API-related errors (4xx, 5xx responses)
 */
export class APIError extends AppError {
  constructor(
    message: string,
    statusCode: number,
    public details?: any
  ) {
    super(message, 'API_ERROR', statusCode);
    this.name = 'APIError';
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

/**
 * Authentication/Authorization errors
 */
export class AuthError extends AppError {
  constructor(message: string = 'Authentication failed. Please try again.') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthError';
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

/**
 * Data validation errors
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    public fields?: { [key: string]: string }
  ) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Resource not found errors
 */
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found.`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Permission/access denied errors
 */
export class PermissionError extends AppError {
  constructor(message: string = 'Permission denied.') {
    super(message, 'PERMISSION_ERROR', 403);
    this.name = 'PermissionError';
    Object.setPrototypeOf(this, PermissionError.prototype);
  }
}

/**
 * Type guard to check if error is a NetworkError
 */
export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

/**
 * Type guard to check if error is an APIError
 */
export function isAPIError(error: unknown): error is APIError {
  return error instanceof APIError;
}

/**
 * Type guard to check if error is an AuthError
 */
export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}

/**
 * Type guard to check if error is a ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

/**
 * Type guard to check if error is a NotFoundError
 */
export function isNotFoundError(error: unknown): error is NotFoundError {
  return error instanceof NotFoundError;
}

/**
 * Type guard to check if error is a PermissionError
 */
export function isPermissionError(error: unknown): error is PermissionError {
  return error instanceof PermissionError;
}

/**
 * Type guard to check if error is any AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Get user-friendly error message from any error type
 */
export function getErrorMessage(error: unknown): string {
  if (isNetworkError(error)) {
    return error.message;
  }

  if (isAPIError(error)) {
    return error.message;
  }

  if (isAuthError(error)) {
    return error.message;
  }

  if (isValidationError(error)) {
    return error.message;
  }

  if (isNotFoundError(error)) {
    return error.message;
  }

  if (isPermissionError(error)) {
    return error.message;
  }

  if (isAppError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Parse fetch error and convert to appropriate AppError
 */
export function parseFetchError(error: unknown, response?: Response): AppError {
  // Network error (no response)
  if (!response) {
    if (error instanceof Error && error.message.includes('fetch')) {
      return new NetworkError();
    }
    return new NetworkError('Unable to connect to server.');
  }

  // HTTP status code errors
  const statusCode = response.status;

  if (statusCode === 401) {
    return new AuthError();
  }

  if (statusCode === 403) {
    return new PermissionError();
  }

  if (statusCode === 404) {
    return new NotFoundError();
  }

  if (statusCode >= 400 && statusCode < 500) {
    return new ValidationError(`Request failed with status ${statusCode}`);
  }

  if (statusCode >= 500) {
    return new APIError('Server error. Please try again later.', statusCode);
  }

  return new AppError('An unexpected error occurred.', 'UNKNOWN', statusCode);
}
