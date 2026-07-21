export type UploadedImage = {
  path: string; // public url path returned from backend
};

export const ALLOWED_IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp']);
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length < 2) return '';
  return parts[parts.length - 1].toLowerCase();
}

export function validateImageFile(file: File): string | null {
  const ext = getFileExtension(file.name);
  if (!ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
    return 'Invalid image type. Allowed: jpg, jpeg, png, webp';
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return 'Image too large. Maximum size is 5MB.';
  }
  return null;
}

