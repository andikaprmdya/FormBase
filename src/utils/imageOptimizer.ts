import { Alert } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import { IMAGE_CONFIG } from '../constants/appConstants';
import { logger } from './logger';

/**
 * Image optimization utility
 * Handles image compression, resizing, and validation
 */

export interface ImageOptimizationOptions {
  /** Maximum width in pixels */
  maxWidth?: number;
  /** Maximum height in pixels */
  maxHeight?: number;
  /** Compression quality (0-1) */
  quality?: number;
  /** Whether to maintain aspect ratio */
  maintainAspectRatio?: boolean;
}

/**
 * Get base64 image size in bytes
 */
export function getBase64Size(base64String: string): number {
  // Remove data URL prefix if present
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');

  // Calculate size: each base64 character represents 6 bits
  // Padding characters (=) should be subtracted
  const padding = (base64Data.match(/=/g) || []).length;
  return (base64Data.length * 3 / 4) - padding;
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Optimize image with progressive quality reduction
 * Reduces quality until size is under max size
 */
export async function optimizeImage(
  uri: string,
  options: ImageOptimizationOptions = {}
): Promise<{ uri: string; base64: string; size: number } | null> {
  try {
    const {
      maxWidth = 1920,
      maxHeight = 1920,
      quality = IMAGE_CONFIG.QUALITY,
      maintainAspectRatio = true,
    } = options;

    logger.log('Optimizing image:', uri);

    // Prepare manipulation actions
    const actions: ImageManipulator.Action[] = [];

    // Resize if needed
    actions.push({
      resize: {
        width: maxWidth,
        height: maintainAspectRatio ? undefined : maxHeight,
      },
    });

    // Start with specified quality
    let currentQuality = quality;
    let result: ImageManipulator.ImageResult;
    let attemptCount = 0;
    const maxAttempts = 5;

    do {
      attemptCount++;
      logger.log(`Optimization attempt ${attemptCount} with quality ${currentQuality}`);

      result = await ImageManipulator.manipulateAsync(
        uri,
        actions,
        {
          compress: currentQuality,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      if (!result.base64) {
        logger.error('No base64 data in result');
        return null;
      }

      const base64WithPrefix = `data:image/jpeg;base64,${result.base64}`;
      const size = getBase64Size(base64WithPrefix);

      logger.log(`Result size: ${formatBytes(size)}`);

      // Check if size is acceptable
      if (size <= IMAGE_CONFIG.MAX_SIZE) {
        // Warn if size is over warning threshold
        if (size > IMAGE_CONFIG.WARNING_SIZE) {
          Alert.alert(
            'Large Image',
            `This image is ${formatBytes(size)}. Consider using a smaller image for better performance.`,
            [{ text: 'OK' }]
          );
        }

        logger.log('Image optimization successful');
        return {
          uri: result.uri,
          base64: base64WithPrefix,
          size,
        };
      }

      // Reduce quality for next attempt
      currentQuality *= 0.7;

    } while (attemptCount < maxAttempts && currentQuality > 0.1);

    // If we've exhausted attempts, image is too large
    Alert.alert(
      'Image Too Large',
      `Unable to compress image below ${formatBytes(IMAGE_CONFIG.MAX_SIZE)}. Please use a smaller image.`
    );

    return null;

  } catch (error) {
    logger.error('Image optimization error:', error);
    Alert.alert('Error', 'Failed to optimize image. Please try again.');
    return null;
  }
}

/**
 * Validate image before processing
 */
export async function validateImage(base64: string): Promise<boolean> {
  const size = getBase64Size(base64);

  logger.log(`Validating image size: ${formatBytes(size)}`);

  if (size > IMAGE_CONFIG.MAX_SIZE) {
    Alert.alert(
      'Image Too Large',
      `Image size (${formatBytes(size)}) exceeds maximum allowed size of ${formatBytes(IMAGE_CONFIG.MAX_SIZE)}.`
    );
    return false;
  }

  return true;
}

/**
 * Get optimal image dimensions while maintaining aspect ratio
 */
export function getOptimalDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight;

  let width = originalWidth;
  let height = originalHeight;

  // Scale down if exceeds max dimensions
  if (width > maxWidth) {
    width = maxWidth;
    height = width / aspectRatio;
  }

  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
  };
}
