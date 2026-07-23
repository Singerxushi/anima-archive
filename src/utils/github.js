const DEFAULT_GITHUB = {
  owner: 'Singerxushi',
  repo: 'anima-archive',
};

function resolveGithubConfig(githubConfig = {}) {
  return {
    owner: githubConfig.owner || DEFAULT_GITHUB.owner,
    repo: githubConfig.repo || DEFAULT_GITHUB.repo,
    token: githubConfig.token || '',
  };
}

export function generateGithubIssueUrl(githubConfig = {}, paper) {
  const { owner, repo } = resolveGithubConfig(githubConfig);

  const base = `https://github.com/${owner}/${repo}/issues/new`;

  const title = encodeURIComponent(
    `[Submission] ${paper.title} - ${paper.author || 'Anonymous'}`
  );

  const body = encodeURIComponent(`### ANIMA JOURNAL SUBMISSION

**论文题目 (Title):**
${paper.title}

**作者/笔名 (Author):**
${paper.author || 'Anonymous'}

**联系信箱 (Email):**
${paper.email || '未填写'}

**论文大纲与摘要 (Abstract & Outline):**
${paper.abstract}

---

*Created via Anima Archive Portal.*
This submission will be reviewed by the editorial board.`);

  return `${base}?title=${title}&body=${body}&labels=journal-submission`;
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

  const path = `archive/${item.id}.json`;

  const contentBase64 = btoa(
    unescape(encodeURIComponent(JSON.stringify(item, null, 2)))
  );

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
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
    const errData = await response.json();
    throw new Error(errData.message || 'API 异常');
  }

  return response;
}
