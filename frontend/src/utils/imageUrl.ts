// Normalize product image URLs returned from the API.
// Fixes cases where the backend (or DB) stores absolute Windows paths (e.g. C:\\...)
// or file:///<absolute-path> URLs, which browsers block from http origins.

const WINDOWS_DRIVE_PATH_RE = /^[a-zA-Z]:\\/;
const FILE_URL_RE = /^file:\/\//i;

const isProbablyUrl = (value: string) => /^https?:\/\//i.test(value);

export function normalizeImageUrl(raw: unknown, opts?: { backendBaseUrl?: string }): string {
  if (typeof raw !== 'string') {
    return '';
  }

  const value = raw.trim();
  if (!value) return '';

  // Leave valid http(s) URLs untouched.
  if (isProbablyUrl(value)) return value;

  // If backend stored file:///<windows or linux path>, extract the path portion.
  // Example: file:///C:/Users/.../pads/backend/uploads/products/a.jpg
  if (FILE_URL_RE.test(value)) {
    // Remove `file:///` prefix (or file://)
    const withoutScheme = value.replace(/^file:\/\//i, ''); // now starts like C:/... or /C:/...
    return normalizeImageUrl(withoutScheme, opts);
  }

  // If backend stored Windows absolute path, convert it to the relative upload path.
  // Example: C:\Users\HARSH\...\backend\uploads\products\a.jpg
  if (WINDOWS_DRIVE_PATH_RE.test(value)) {
    // Convert backslashes to slashes for splitting.
    const unified = value.replace(/\\/g, '/');
    const marker = '/uploads/';
    const idx = unified.toLowerCase().indexOf(marker);
    if (idx !== -1) {
      const relFromUploads = unified.slice(idx + marker.length); // products/a.jpg
      return buildWebUrlFromUploads(relFromUploads, opts);
    }
    return '';
  }

  // Handle cases like /uploads/products/a.jpg (already relative web path)
  if (value.startsWith('/uploads/')) {
    return buildWebUrlFromUploads(value.replace(/^\/uploads\//, ''), opts);
  }

  // Some systems might store `uploads/products/a.jpg` without leading slash.
  if (value.startsWith('uploads/')) {
    return buildWebUrlFromUploads(value.slice('uploads/'.length), opts);
  }

  // If already relative (e.g. /static/products/a.jpg) leave it as-is.
  if (value.startsWith('/static/')) return value;

  // Otherwise, return as-is to avoid breaking contracts; browser may still fail,
  // but we only modify known-bad path formats.
  return value;
}

function buildWebUrlFromUploads(relativePathFromUploads: string, opts?: { backendBaseUrl?: string }): string {
  const backendBaseUrl = opts?.backendBaseUrl || '';
  const webPath = `/uploads/${relativePathFromUploads.replace(/^\/+/, '')}`;
  return backendBaseUrl ? `${backendBaseUrl}${webPath}` : webPath;
}

// Central fallback used across the app for safe <img src> rendering.
// Keeps existing API contracts unchanged.
export function getImageFallbackSrc(src: string | null | undefined): string {
  if (!src) return '';
  const v = String(src).trim();
  return v;
}


