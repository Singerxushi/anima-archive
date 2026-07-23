/**
 * Anima Archive
 *
 * GitHub Utility Layer
 *
 * GitHub Only Architecture
 *
 * Responsibilities:
 *
 * 1. GitHub Issue submission
 * 2. GitHub Discussions navigation
 * 3. Archive compatibility interface
 *
 * Discussions data sync is handled by:
 * GitHub Actions -> public/data/discussions.json
 */


/**
 * 默认仓库配置
 */
const DEFAULT_GITHUB_CONFIG = {

  owner:
    "Singerxushi",

  repo:
    "anima-archive"

};



/**
 * 统一处理 GitHub 配置
 */
function resolveGithubConfig(
  config = {}
){

  return {

    owner:
      config.owner
      ||
      DEFAULT_GITHUB_CONFIG.owner,


    repo:
      config.repo
      ||
      DEFAULT_GITHUB_CONFIG.repo,


  };

}



/**
 * 创建 Journal 投稿 Issue
 *
 * GitHub Issues 作为期刊投稿入口
 */
export function generateGithubIssueUrl(
  githubConfig = {},
  paper = {}
){


  const {

    owner,

    repo

  }
  =
  resolveGithubConfig(
    githubConfig
  );



  const title =
    encodeURIComponent(
      `[Journal Submission] ${
        paper.title ||
        "Untitled Paper"
      }`
    );



  const body =
    encodeURIComponent(
`
## ANIMA JOURNAL SUBMISSION


### Title

${paper.title || ""}


### Author

${paper.author || "Anonymous"}


### Email

${paper.email || ""}


### Abstract

${paper.abstract || ""}


---

Submitted through Anima Archive.
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
 * GitHub Discussions 页面
 *
 * 用于 Open Discussions 按钮
 */
export function getDiscussionsUrl(
  githubConfig = {}
){

  const {

    owner,

    repo

  }
  =
  resolveGithubConfig(
    githubConfig
  );



  return (

    `https://github.com/${owner}/${repo}/discussions`

  );

}





/**
 * Archive 同步兼容接口
 *
 * 旧版 App.jsx 可能调用
 *
 * 新架构:
 *
 * Archive 数据
 * ↓
 * GitHub Actions
 *
 * 因此这里不直接上传 token
 */
export async function syncArchiveToGithub(
  githubConfig = {},
  archiveItem = {}
){


  const {

    owner,

    repo

  }
  =
  resolveGithubConfig(
    githubConfig
  );



  if(!archiveItem.id){

    throw new Error(
      "Archive item requires id"
    );

  }



  return {

    success:true,


    repository:

      `${owner}/${repo}`,


    item:

      archiveItem,


    message:

      "Archive synchronization is handled by GitHub Actions."

  };


}





/**
 * 兼容旧代码
 *
 * 旧版组件如果仍调用：
 *
 * fetchGithubForumDiscussions()
 *
 * 不再访问 GraphQL
 *
 * 改读取缓存文件
 */
export async function fetchGithubForumDiscussions(){


  const response =

    await fetch(

      "./data/discussions.json",

      {

        cache:
          "no-store"

      }

    );



  if(!response.ok){

    throw new Error(

      "Discussion cache unavailable"

    );

  }



  const data =

    await response.json();



  return (

    data.discussions

    ||

    []

  );

}




/**
 * 检查 GitHub 配置
 *
 * 保留兼容
 */
export function getGithubConfig(){

  return {

    ...DEFAULT_GITHUB_CONFIG

  };

}
