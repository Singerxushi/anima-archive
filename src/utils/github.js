export function generateGithubIssueUrl(githubConfig, paper) {
  const base = `https://github.com/${githubConfig.owner || 'YOUR_USER'}/${githubConfig.repo || 'YOUR_REPO'}/issues/new`;
  const title = encodeURIComponent(`[Submission] ${paper.title} - ${paper.author}`);
  const body = encodeURIComponent(`### ANIMA JOURNAL SUBMISSION

**论文题目 (Title):** ${paper.title}
**作者/笔名 (Author):** ${paper.author}
**联系信箱 (Email):** ${paper.email}

**论文大纲与摘要 (Abstract & Outline):**
${paper.abstract}

---
*Created via Anima Archive Portal. This submission will be automatically processed by the editorial board.*`);

  return `${base}?title=${title}&body=${body}&labels=journal-submission`;
}

export function getDiscussionsUrl(githubConfig) {
  return `https://github.com/${githubConfig.owner || 'YOUR_USER'}/${githubConfig.repo || 'YOUR_REPO'}/discussions`;
}

export async function syncArchiveToGithub(githubConfig, item) {
  const path = `archive/${item.id}.json`;
  const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(item, null, 2))));

  const response = await fetch(
    `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${githubConfig.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `archive: add [${item.title}] to subconscious records`,
        content: contentBase64,
        branch: 'main',
      }),
    },
  );

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.message || 'API 异常');
  }

  return response;
}

