/**
 * 修改原因：
 * 1. 修复 YOUR_USER / YOUR_REPO 占位符导致的无效链接。
 * 2. 统一 Issues / Discussions / Contents API 的配置解析逻辑。
 * 3. 与 src/config/github.js 对齐，保留向后兼容。
 *
 * 兼容性注意：
 * - 外部仍可传入 { owner, repo, token }。
 * - 如果未来迁移到后端代理 / GitHub App，只需要替换 syncArchiveToGithub 的实现。
 */

import { combineGithubConfig } from '../config/github';

function toBase64Unicode(value) {
  return btoa(unescape(encodeURIComponent(value)));
}

function normalizePaper(paper = {}) {
  return {
    title: String(paper.title || '').trim(),
    author: String(paper.author || '').trim() || 'Anonymous',
    email: String(paper.email || '').trim(),
    abstract: String(paper.abstract || '').trim(),
  };
}

export function resolveGithubConfig(githubConfig = {}) {
  return combineGithubConfig(githubConfig, githubConfig.token || '');
}

export function getRepositoryUrl(githubConfig = {}) {
  const { owner, repo } = resolveGithubConfig(githubConfig);
  return `https://github.com/${owner}/${repo}`;
}

export function getDiscussionsUrl(githubConfig = {}) {
  const { owner, repo } = resolveGithubConfig(githubConfig);
  return `https://github.com/${owner}/${repo}/discussions`;
}

export function generateGithubIssueUrl(githubConfig = {}, paper = {}) {
  const { owner, repo } = resolveGithubConfig(githubConfig);
  const normalizedPaper = normalizePaper(paper);

  const title = encodeURIComponent(
    `[Submission] ${normalizedPaper.title || 'Untitled'} - ${normalizedPaper.author}`
  );

  const body = encodeURIComponent(`### ANIMA JOURNAL SUBMISSION

**论文题目 (Title):**
${normalizedPaper.title}

**作者/笔名 (Author):**
${normalizedPaper.author}

**联系信箱 (Email):**
${normalizedPaper.email || '未填写'}

**论文大纲与摘要 (Abstract & Outline):**
${normalizedPaper.abstract}

---

*Created via Anima Archive Portal.*
This submission should be reviewed in GitHub Issues.`);

  return `https://github.com/${owner}/${repo}/issues/new?title=${title}&body=${body}&labels=journal-submission`;
}

export async function syncArchiveToGithub(githubConfig = {}, item) {
  const { owner, repo, token } = resolveGithubConfig(githubConfig);

  if (!token) {
    throw new Error('缺少 GitHub token，无法写入远程仓库');
  }

  if (!item?.id || !item?.title) {
    throw new Error('档案对象不完整，无法写入远程仓库');
  }

  const path = `archive/${item.id}.json`;
  const contentBase64 = toBase64Unicode(JSON.stringify(item, null, 2));

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `archive: add [${item.title}] to subconscious records`,
        content: contentBase64,
        branch: 'main',
      }),
    }
  );

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || 'API 异常');
  }

  return response;
}
