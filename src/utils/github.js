/**
 * GitHub Only Service Layer
 * Anima Archive
 */


/**
 * 默认仓库
 */
const DEFAULT_GITHUB = {
  owner: "Singerxushi",
  repo: "anima-archive",
};



/**
 * 处理 GitHub 配置
 */
function resolveGithubConfig(
  githubConfig = {}
){

  return {

    owner:
      githubConfig.owner ||
      DEFAULT_GITHUB.owner,

    repo:
      githubConfig.repo ||
      DEFAULT_GITHUB.repo,

    token:
      githubConfig.token ||
      "",

  };

}



/**
 * 创建 Issue 投稿链接
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
`
### ANIMA JOURNAL SUBMISSION


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
 * 获取 GitHub Discussions
 *
 * 注意：
 * GitHub GraphQL API 必须需要 token
 * 因为 GitHub Pages 是静态站，
 * 不能暴露 token。
 *
 * 因此这里采用匿名失败保护。
 */
export async function fetchGithubForumDiscussions(
  githubConfig = {}
){

  const {
    owner,
    repo,
    token
  } = resolveGithubConfig(githubConfig);



  if(!token){

    throw new Error(
      "GitHub token missing"
    );

  }



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
            "application/json",

          Authorization:
            `bearer ${token}`

        },


        body:
          JSON.stringify({
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
 * Archive 同步
 *
 * 保留兼容旧 App.jsx
 */
export async function syncArchiveToGithub(
  githubConfig = {},
  item = {}
){

  const {
    owner,
    repo,
    token
  } = resolveGithubConfig(githubConfig);



  if(!token){

    throw new Error(
      "缺少 GitHub token，无法同步"
    );

  }



  const path =
    `archive/${item.id}.json`;



  const content =
    btoa(
      unescape(
        encodeURIComponent(
          JSON.stringify(
            item,
            null,
            2
          )
        )
      )
    );



  const response =
    await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {

        method:"PUT",

        headers:{

          Authorization:
            `token ${token}`,

          "Content-Type":
            "application/json"

        },


        body:
          JSON.stringify({

            message:
              `archive: add ${item.title}`,

            content,

            branch:
              "main"

          })

      }
    );



  if(!response.ok){

    throw new Error(
      "GitHub archive sync failed"
    );

  }


  return response;

}
