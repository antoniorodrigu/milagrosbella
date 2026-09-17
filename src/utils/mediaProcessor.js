/**
 * Utility functions for client-side image and video processing before upload.
 */

export function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Resizes an image file to a lightweight WebP thumbnail.
 * @param {File|Blob} file
 * @param {number} maxDimension
 * @param {number} quality
 * @returns {Promise<{ blob: Blob, width: number, height: number }>}
 */
export async function createImageThumbnail(file, maxDimension = 800, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({ blob, width, height });
          } else {
            reject(new Error('Failed to create thumbnail blob'));
          }
        },
        'image/webp',
        quality
      );
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };

    img.src = url;
  });
}

/**
 * Captures a representative video frame and converts it to a WebP thumbnail.
 * @param {File|Blob} file
 * @param {number} seekTime
 * @returns {Promise<{ blob: Blob, width: number, height: number, duration: number }>}
 */
export async function createVideoThumbnail(file, seekTime = 0.5) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    const url = URL.createObjectURL(file);

    const cleanup = () => {
      URL.revokeObjectURL(url);
      video.remove();
    };

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(seekTime, video.duration / 2);
    };

    video.onseeked = () => {
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 360;
      const duration = Math.round(video.duration || 0);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          cleanup();
          if (blob) {
            resolve({ blob, width, height, duration });
          } else {
            reject(new Error('Failed to create video thumbnail blob'));
          }
        },
        'image/webp',
        0.85
      );
    };

    video.onerror = (err) => {
      cleanup();
      reject(err);
    };

    video.src = url;
  });
}
