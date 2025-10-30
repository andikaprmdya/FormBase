/**
 * Application-wide constants
 * Centralizes magic numbers and configuration values
 */

// Image Configuration
export const IMAGE_CONFIG = {
  /** Image quality for compression (0-1) */
  QUALITY: 0.3,
  /** Maximum image file size in bytes (10MB) */
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  /** Warning threshold for image size in bytes (5MB) */
  WARNING_SIZE: 5 * 1024 * 1024, // 5MB
  /** Image aspect ratio for editing */
  ASPECT_RATIO: [4, 3] as [number, number],
} as const;

// Map Configuration
export const MAP_CONFIG = {
  /** Latitude offset to shift marker position on map */
  LATITUDE_OFFSET: -0.015,
  /** Default latitude delta for map region */
  LATITUDE_DELTA: 0.0922,
  /** Default longitude delta for map region */
  LONGITUDE_DELTA: 0.0421,
  /** Default map center (Brisbane, Australia) */
  DEFAULT_CENTER: {
    latitude: -27.4705,
    longitude: 153.0260,
  },
} as const;

// Animation Configuration
export const ANIMATION_CONFIG = {
  /** Animation duration for map centering (ms) */
  MAP_CENTER_DURATION: 1000,
  /** Delay before clearing navigation params (ms) */
  NAV_PARAMS_CLEAR_DELAY: 600,
  /** Delay before animating to region (ms) */
  MAP_ANIMATION_DELAY: 500,
} as const;

// API Configuration
export const API_CONFIG = {
  /** Base URL for the API */
  BASE_URL: 'https://comp2140a3.uqcloud.net/api',
  /** Request timeout in milliseconds */
  TIMEOUT: 30000, // 30 seconds
} as const;

// Pagination Configuration
export const PAGINATION_CONFIG = {
  /** Default number of items per page */
  ITEMS_PER_PAGE: 20,
  /** Maximum number of items to load at once */
  MAX_ITEMS: 100,
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  /** Cache expiry time in milliseconds (5 minutes) */
  EXPIRY_TIME: 5 * 60 * 1000,
  /** Maximum number of cached items */
  MAX_ITEMS: 50,
} as const;

// Form Validation
export const VALIDATION_CONFIG = {
  /** Minimum form name length */
  MIN_FORM_NAME_LENGTH: 1,
  /** Maximum form name length */
  MAX_FORM_NAME_LENGTH: 100,
  /** Minimum field name length */
  MIN_FIELD_NAME_LENGTH: 1,
  /** Maximum field name length */
  MAX_FIELD_NAME_LENGTH: 50,
  /** Maximum number of multiple choice options */
  MAX_OPTIONS: 20,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your internet connection and try again.',
  GENERIC: 'An unexpected error occurred. Please try again.',
  FORM_NOT_FOUND: 'Form not found. It may have been deleted.',
  FIELD_NOT_FOUND: 'Field not found.',
  RECORD_NOT_FOUND: 'Record not found.',
  NO_FIELDS: 'This form has no fields yet. Please add fields first.',
  LOAD_FORMS_FAILED: 'Failed to load forms. Please try again.',
  LOAD_FIELDS_FAILED: 'Failed to load fields. Please try again.',
  LOAD_RECORDS_FAILED: 'Failed to load records. Please try again.',
  CREATE_FORM_FAILED: 'Failed to create form. Please try again.',
  UPDATE_FORM_FAILED: 'Failed to update form. Please try again.',
  DELETE_FORM_FAILED: 'Failed to delete form. Please try again.',
  CREATE_FIELD_FAILED: 'Failed to create field. Please try again.',
  DELETE_FIELD_FAILED: 'Failed to delete field. Please try again.',
  CREATE_RECORD_FAILED: 'Failed to create record. Please try again.',
  DELETE_RECORD_FAILED: 'Failed to delete record. Please try again.',
  LOCATION_PERMISSION_DENIED: 'Location permission is required to use this feature.',
  LOCATION_FAILED: 'Failed to get location. Please try again.',
  CAMERA_PERMISSION_DENIED: 'Camera permission is required.',
  LIBRARY_PERMISSION_DENIED: 'Photo library permission is required.',
  IMAGE_FAILED: 'Failed to load image. Please try again.',
  IMAGE_TOO_LARGE: 'Image is too large. Maximum size is 10MB.',
  COPY_FAILED: 'Failed to copy to clipboard.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  FORM_CREATED: 'Form created successfully!',
  FORM_UPDATED: 'Form updated successfully!',
  FORM_DELETED: 'Form deleted successfully!',
  FIELD_CREATED: 'Field added successfully!',
  FIELD_DELETED: 'Field deleted successfully!',
  RECORD_CREATED: 'Record saved successfully!',
  RECORD_DELETED: 'Record deleted successfully!',
  COPY_SUCCESS: 'Copied to clipboard!',
} as const;
