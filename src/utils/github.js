/**
 * 修改原因：
 * 1. 兼容现有 App.jsx / Forum.jsx / Journal.jsx 的调用方式。
 * 2. 修复 YOUR_USER / YOUR_REPO 占位符导致的 Discussions / Issue 链接错误。
 * 3. 在不改动当前 localStorage 结构的前提下，为 owner / repo 提供默认值。
 *
 * 兼容性注意：
 * - 仍然接受 { owner, repo, token } 结构。
 * - 仍然支持前端直接调用 GitHub Contents API。
 * - 仍然会在存在 token 时直接写仓库，因此这只是“最小补丁”，不是最终安全方案。
 */

const DEFAULT_GITHUB = {
  owner: 'Singerxushi',
  repo: 'anima-archive',
};

function normalizeValue(value) {
  return String(value || '').trim();
}

function resolveGithubConfig(githubConfig = {}) {
  const rawOwner = normalizeValue(githubConfig.owner);
  const rawRepo = normalizeValue(githubConfig.repo);
  const rawToken = normalizeValue(githubConfig.token);

  const owner =
    rawOwner && rawOwner !== 'YOUR_USER' ? rawOwner : DEFAULT_GITHUB.owner;

  const repo =
    rawRepo && rawRepo !== 'YOUR_REPO' ? rawRepo : DEFAULT_GITHUB.repo;

  return {
    owner,
    repo,
    token: rawToken,
  };
}

function toBase64Unicode(value) {
  return btoa(unescape(encodeURIComponent(value)));
}

export function generateGithubIssueUrl(githubConfig = {}, paper = {}) {
  const { owner, repo } = resolveGithubConfig(githubConfig);

  const title = encodeURIComponent(
    `[Submission] ${paper.title || 'Untitled'} - ${paper.author || 'Anonymous'}`
  );

  const body = encodeURIComponent(`### ANIMA JOURNAL SUBMISSION

**论文题目 (Title):**
${paper.title || ''}

**作者/笔名 (Author):**
${paper.author || 'Anonymous'}

**联系信箱 (Email):**
${paper.email || ''}

**论文大纲与摘要 (Abstract & Outline):**
${paper.abstract || ''}

---

*Created via Anima Archive Portal.
This submission will be automatically processed by the editorial board.*`);

  return `https://github.com/${owner}/${repo}/issues/new?title=${title}&body=${body}&labels=journal-submission`;
}

export function getDiscussionsUrl(githubConfig = {}) {
  const { owner, repo } = resolveGithubConfig(githubConfig);
  return `https://github.com/${owner}/${repo}/discussions`;
}

export async function syncArchiveToGithub(githubConfig = {}, item) {
  const { owner, repo, token } = resolveGithubConfig(githubConfig);

  if (!token) {
    throw new Error('缺少 GitHub token，无法同步到远程仓库');
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
