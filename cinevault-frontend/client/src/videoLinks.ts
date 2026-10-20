export type MovieAdminOverride = {
  youtubeUrl?: string;
  thumbnail?: string;
};

export type AdminConfig = {
  adLink: string;
  movies: Record<string, MovieAdminOverride>;
};

export const ADMIN_CONFIG_KEY = "cinevault-admin-config";
export const AD_LINK = "https://example.com/replace-with-your-ad-link";

export const YOUTUBE_LINKS: Record<string, string> = {
  // "Nocturne Protocol": "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
};

export const defaultAdminConfig: AdminConfig = {
  adLink: AD_LINK,
  movies: Object.fromEntries(Object.entries(YOUTUBE_LINKS).map(([title, youtubeUrl]) => [title, { youtubeUrl }])),
};

export function getAdminConfig(): AdminConfig {
  if (typeof window === "undefined") return defaultAdminConfig;
  try {
    const raw = window.localStorage.getItem(ADMIN_CONFIG_KEY);
    if (!raw) return defaultAdminConfig;
    const parsed = JSON.parse(raw) as Partial<AdminConfig>;
    return {
      adLink: parsed.adLink || AD_LINK,
      movies: parsed.movies || {},
    };
  } catch {
    return defaultAdminConfig;
  }
}

export function saveAdminConfig(config: AdminConfig) {
  window.localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(config));
  window.dispatchEvent(new CustomEvent("cinevault-admin-updated"));
}

export function getYoutubeLink(title: string, config = getAdminConfig()) {
  return config.movies[title]?.youtubeUrl || YOUTUBE_LINKS[title] || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} full movie`)}`;
}

export function getYoutubeEmbedUrl(title: string, config = getAdminConfig()) {
  const link = getYoutubeLink(title, config);
  try {
    const url = new URL(link);
    let videoId = url.searchParams.get("v");
    if (!videoId && url.hostname === "youtu.be") videoId = url.pathname.slice(1);
    if (!videoId && url.pathname.startsWith("/embed/")) videoId = url.pathname.split("/")[2];
    if (!videoId && url.pathname.startsWith("/shorts/")) videoId = url.pathname.split("/")[2];
    return videoId ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0` : null;
  } catch {
    return null;
  }
}
