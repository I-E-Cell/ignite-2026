/**
 * Utility functions for parsing, validating, and generating embed URLs
 * for video pitches (YouTube, Google Drive) and live project prototypes.
 */

export type VideoPlatform = "youtube" | "drive" | "other" | null;

export interface VideoEmbedResult {
  platform: VideoPlatform;
  embedUrl: string | null;
  originalUrl: string;
}

/**
 * Checks whether a given URL is safe to use in an iframe or anchor tag.
 * Blocks dangerous schemes like javascript:, data:, vbscript:, file:.
 */
export function isSafeEmbedUrl(url?: string): boolean {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed.startsWith("javascript:") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("vbscript:") ||
    trimmed.startsWith("file:")
  ) {
    return false;
  }
  return true;
}

/**
 * Normalizes input URL by adding https:// protocol if missing.
 * Rejects dangerous or malicious URL schemes.
 */
export function normalizeUrl(rawUrl?: string): string {
  if (!rawUrl) return "";
  const trimmed = rawUrl.trim();
  if (!trimmed || !isSafeEmbedUrl(trimmed)) return "";
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Extracts YouTube Video ID and returns secure no-cookie embed URL.
 * Supports standard watch, short URLs, embeds, and YouTube Shorts.
 */
export function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const normalized = normalizeUrl(url);

  try {
    // 1. Short links: https://youtu.be/<id>
    const shortMatch = normalized.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch && shortMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${shortMatch[1]}?rel=0`;
    }

    // 2. Standard watch: https://(www.)?youtube.com/watch?v=<id>
    const watchMatch = normalized.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch && watchMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}?rel=0`;
    }

    // 3. Shorts or Embed: https://youtube.com/(embed|shorts)/<id>
    const pathMatch = normalized.match(/youtube\.com\/(?:embed|shorts|v)\/([a-zA-Z0-9_-]{11})/);
    if (pathMatch && pathMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${pathMatch[1]}?rel=0`;
    }
  } catch {
    // ignore
  }

  return null;
}

/**
 * Extracts Google Drive file ID and returns preview embed URL.
 * Supports /file/d/<id>/view and ?id=<id> formats.
 */
export function getGoogleDriveEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const normalized = normalizeUrl(url);

  try {
    // 1. Standard Drive URL: https://drive.google.com/file/d/<id>/view...
    const fileMatch = normalized.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch && fileMatch[1]) {
      return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
    }

    // 2. Query param: https://drive.google.com/open?id=<id>
    const queryMatch = normalized.match(/drive\.google\.com\/(?:open|uc)\?(?:[^&]+&)*id=([a-zA-Z0-9_-]+)/);
    if (queryMatch && queryMatch[1]) {
      return `https://drive.google.com/file/d/${queryMatch[1]}/preview`;
    }
  } catch {
    // ignore
  }

  return null;
}

/**
 * Detects whether a URL belongs to YouTube, Google Drive, or another platform.
 */
export function detectVideoPlatform(url?: string): VideoPlatform {
  if (!url || !url.trim()) return null;
  const normalized = normalizeUrl(url).toLowerCase();

  if (normalized.includes("youtube.com") || normalized.includes("youtu.be")) {
    return "youtube";
  }
  if (normalized.includes("drive.google.com")) {
    return "drive";
  }
  return "other";
}

/**
 * Parses any video pitch URL into an embeddable result.
 */
export function getVideoEmbedInfo(url?: string): VideoEmbedResult {
  if (!url || !url.trim()) {
    return { platform: null, embedUrl: null, originalUrl: "" };
  }

  const normalized = normalizeUrl(url);
  const platform = detectVideoPlatform(normalized);

  if (platform === "youtube") {
    const embedUrl = getYouTubeEmbedUrl(normalized);
    return { platform: "youtube", embedUrl, originalUrl: normalized };
  }

  if (platform === "drive") {
    const embedUrl = getGoogleDriveEmbedUrl(normalized);
    return { platform: "drive", embedUrl, originalUrl: normalized };
  }

  return { platform: "other", embedUrl: null, originalUrl: normalized };
}

/**
 * Cleans a URL to return a short human-readable domain for address bars.
 */
export function getCleanDomain(url?: string): string {
  if (!url) return "";
  try {
    const parsed = new URL(normalizeUrl(url));
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
