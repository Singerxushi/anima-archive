const DEFAULT_GITHUB = {
  owner: "Singerxushi",
  repo: "anima-archive"
};


export function generateGithubIssueUrl(githubConfig = DEFAULT_GITHUB, paper) {
  const owner = githubConfig.owner || DEFAULT_GITHUB.owner;
  const repo = githubConfig.repo || DEFAULT_GITHUB.repo;

  const base =
    `https://github.com/${owner}/${repo}/issues/new`;

  const title =
    encodeURIComponent(`[Submission] ${paper.title} - ${paper.author}`);

  const body =
    encodeURIComponent(`
### ANIMA JOURNAL SUBMISSION

论文题目:
${paper.title}

作者:
${paper.author}

摘要:
${paper.abstract}
`);

  return `${base}?title=${title}&body=${body}&labels=journal-submission`;
}


export function getDiscussionsUrl(
  githubConfig = DEFAULT_GITHUB
) {
  const owner = githubConfig.owner || DEFAULT_GITHUB.owner;
  const repo = githubConfig.repo || DEFAULT_GITHUB.repo;

  return `https://github.com/${owner}/${repo}/discussions`;
}


export async function syncArchiveToGithub(
  githubConfig = DEFAULT_GITHUB,
  item
) {
  const owner = githubConfig.owner || DEFAULT_GITHUB.owner;
  const repo = githubConfig.repo || DEFAULT_GITHUB.repo;

  const path = `archive/${item.id}.json`;

  // 后续保持你的原逻辑
}
