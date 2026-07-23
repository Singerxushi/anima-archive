import {
  DEFAULT_GITHUB_CONFIG,
  sanitizeGithubConfig,
} from "../config/github";


/**
 * 获取 GitHub 配置
 */
function resolveGithubConfig(config = {}) {

  return sanitizeGithubConfig({
    ...DEFAULT_GITHUB_CONFIG,
    ...config,
  });

}



/**
 * 创建 GitHub Issue 投稿链接
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

Abstract:

${paper.abstract || ""}

---

Submitted via Anima Archive.
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
 * GitHub Discussions 页面地址
 */
export function getDiscussionsUrl(
  githubConfig = {}
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
 * 获取 GitHub Discussions 内容
 *
 * 用于论坛模块读取 GitHub Discussions
 */
export async function fetchGithubForumDiscussions(
  githubConfig = {}
){

  const {
    owner,
    repo
  } = resolveGithubConfig(githubConfig);


  const query = `
  query {
    repository(
      owner:"${owner}"
      name:"${repo}"
    ){

      discussions(
        first:20
        orderBy:{
          field:UPDATED_AT
          direction:DESC
        }
      ){

        nodes{

          id

          title

          body

          url

          author{
            login
          }

          createdAt

          updatedAt


          comments{
            totalCount
          }

        }

      }

    }

  }
  `;


  const response =
    await fetch(
      "https://api.github.com/graphql",
      {

        method:"POST",

        headers:{
          "Content-Type":
            "application/json"
        },


        body:JSON.stringify({
          query
        })

      }
    );


  if(!response.ok){

    throw new Error(
      "Failed to fetch GitHub Discussions"
    );

  }


  const result =
    await response.json();


  return (
    result
      ?.data
      ?.repository
      ?.discussions
      ?.nodes
    ||
    []
  );

}



/**
 * Archive 同步接口
 *
 * 保留旧 App.jsx 调用兼容
 *
 * 实际 GitHub Only 架构中：
 * Archive 数据由 GitHub Actions 管理
 */
export async function syncArchiveToGithub(
  githubConfig = {},
  item = {}
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

    repository:
      `${owner}/${repo}`,

    item,

    message:
      "Archive sync delegated to GitHub Actions"

  };

}
