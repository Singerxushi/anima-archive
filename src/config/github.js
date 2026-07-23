export const GITHUB_STORAGE_KEY = 'anima_github_config_uc';
export const GITHUB_TOKEN_SESSION_KEY = 'anima_github_token_session_uc';

export const DEFAULT_GITHUB_CONFIG = Object.freeze({
  owner: 'Singerxushi',
  repo: 'anima-archive',
});

const INVALID_VALUES = new Set([
  '',
  'YOUR_USER',
  'YOUR_REPO',
  'undefined',
  'null',
]);

const SAFE_REPO_PART = /^[A-Za-z0-9._-]+$/;

export const GITHUB_FORUM_POLL_INTERVAL_MS = Number(
  import.meta.env.VITE_GITHUB_FORUM_POLL_INTERVAL_MS || 60000,
);

export const GITHUB_FORUM_CACHE_URL = `${import.meta.env.BASE_URL}data/forum-discussions.json`;

function normalizeRepoPart(value, fallback) {
  const normalized = String(value || '').trim();

  if (INVALID_VALUES.has(normalized)) {
    return fallback;
  }

  if (!SAFE_REPO_PART.test(normalized)) {
    return fallback;
  }

  return normalized;
}

export function sanitizeGithubConfig(config = {}) {
  return {
    owner: normalizeRepoPart(config.owner, DEFAULT_GITHUB_CONFIG.owner),
    repo: normalizeRepoPart(config.repo, DEFAULT_GITHUB_CONFIG.repo),
  };
}

export function combineGithubConfig(config = {}) {
  return sanitizeGithubConfig(config);
}

export function clearStoredGithubConfig() {
  try {
    localStorage.removeItem(GITHUB_STORAGE_KEY);
  } catch {
    // 浏览器禁用 localStorage 时忽略
  }
}

export function clearStoredGithubToken() {
  try {
    sessionStorage.removeItem(GITHUB_TOKEN_SESSION_KEY);
  } catch {
    // 兼容历史版本遗留 token
  }
}

export function hasWritableGithubToken() {
  return false;
}
