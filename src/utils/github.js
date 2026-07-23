import {
  GITHUB_STORAGE_KEY,
  DEFAULT_GITHUB_CONFIG,
  sanitizeGithubConfig,
} from "../config/github";


function resolveGithubConfig(config = {}) {
  return sanitizeGithubConfig({
    ...DEFAULT_GITHUB_CONFIG,
    ...config,
  });
}


/**
 * GitHub Issues 投稿链接
 */
export function generateGithubIssueUrl(
  githubConfig = {},
  paper = {}
){

  const {
    owner,
    repo
  } = resolveGithubConfig(githubConfig);


  const title =
    encodeURIComponent(
      `[Submission] ${paper.title || "Untitled"}`
    );


  const body =
    encodeURIComponent(
`### ANIMA JOURNAL SUBMISSION

Title:
${paper.title || ""}

Author:
${paper.author || "Anonymous"}

Email:
${paper.email || ""}

Abstract:

${paper.abstract || ""}

---
Created via Anima Archive Portal.
`
    );


  return (
    `https://github.com/${owner}/${repo}/issues/new`
    +
    `?title=${title}`
    +
    `&body=${body}`
    +
    `&labels=journal-submission`
  );

}



/**
 * GitHub Discussions 地址
 */
export function getDiscussionsUrl(
  githubConfig={}
){

  const {
    owner,
    repo
  } = resolveGithubConfig(githubConfig);


  return (
    `https://github.com/${owner}/${repo}/discussions`
  );

}



/**
 * Archive 同步
 * 保留旧 App.jsx 调用接口
 */
export async function syncArchiveToGithub(
  githubConfig={},
  item={}
){

  const {
    owner,
    repo
  } = resolveGithubConfig(githubConfig);


  if(!item.id){
    throw new Error(
      "Archive item missing id"
    );
  }


  return {
    success:true,
    message:
      "Archive sync delegated to GitHub Actions.",
    repository:
      `${owner}/${repo}`,
    item
  };

}
