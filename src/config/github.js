/**
 * 修改原因：
 * 1. 将默认仓库、storage key、配置清洗逻辑集中管理，避免在多个文件重复写死。
 * 2. 为 App.jsx 的 token 会话化存储提供统一常量。
 *
 * 兼容性注意：
 * - 保留现有 localStorage key: anima_github_config_uc
 * - 新增 sessionStorage key: anima_github_token_session_uc
 * - 若旧缓存中仍残留 token 字段，App.jsx 会在启动时迁移
 */

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

export function combineGithubConfig(config = {}, token = '') {
  const safeConfig = sanitizeGithubConfig(config);

  return {
    ...safeConfig,
    token: String(token || '').trim(),
  };
}

export function hasWritableGithubToken(token = '') {
  return Boolean(String(token || '').trim());
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
    // 浏览器禁用 sessionStorage 时忽略
  }
}
