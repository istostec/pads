// Centralized image src helper used by both storefront and admin.
// This is purely frontend-side and does NOT change any API/database contracts.

import { normalizeImageUrl } from './imageUrl';

const PLACEHOLDER_DATA_URL =
  // 1x1 transparent png
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7+W2sAAAAASUVORK5CYII=';

const isProbablyHttp = (v: string) => /^https?:\/\//i.test(v);

/**
 * Convert an image field from the API/DB into a safe <img src> value.
 * - Fixes path formats (/uploads/... or absolute windows paths)
 * - Avoids showing broken image icons by falling back to a placeholder.
 */
export function getSafeImageSrc(
  raw: unknown,
  opts?: {
    // Optional explicit base if the backend stores relative URLs and you need absolute.
    // Default: root-relative is returned.
    backendBaseUrl?: string;
  }
): string {
  const normalized = normalizeImageUrl(raw, {
    backendBaseUrl: opts?.backendBaseUrl,
  });

  if (!normalized) {
    // Support blob URLs (object URLs) used for immediate previews.
    // These won't normalize via normalizeImageUrl.
    if (typeof raw === 'string' && raw.startsWith('blob:')) return raw;
    return PLACEHOLDER_DATA_URL;
  }

  if (isProbablyHttp(normalized)) return normalized;

  // Accept blob URLs (object URLs) used for immediate previews.
  if (normalized.startsWith('blob:')) return normalized;

  // Accept root-relative URLs like /uploads/products/...
  if (normalized.startsWith('/')) return normalized;

  // Anything else is considered unsafe/unknown; show placeholder.
  return PLACEHOLDER_DATA_URL;
}

// Backward-compatible export name used by existing components.
// NOTE: keep UI/business logic intact; this is a pure re-export.
export const getSafeImageSrcLegacy = getSafeImageSrc;

export const IMAGE_PLACEHOLDER_SRC = PLACEHOLDER_DATA_URL;


