import {
  generateGithubIssueUrl as createIssueUrl,
  getDiscussionsUrl as getDiscussionUrl,
} from "../config/github";


const DEFAULT_GITHUB = {
  owner: "Singerxushi",
  repo: "anima-archive",
};


function resolveGithubConfig(config = {}) {

  return {
    owner:
      config.owner ||
      DEFAULT_GITHUB.owner,

    repo:
      config.repo ||
      DEFAULT_GITHUB.repo,

    token:
      config.token ||
      "",
  };

}


export function generateGithubIssueUrl(
  githubConfig = {},
  paper
){

  return createIssueUrl(
    githubConfig,
    paper
  );

}



export function getDiscussionsUrl(
  githubConfig = {}
){

  return getDiscussionUrl(
    githubConfig
  );

}



export async function syncArchiveToGithub(
  githubConfig = {},
  item
){

  const {
    owner,
    repo,
    token
  } = resolveGithubConfig(githubConfig);


  if(!token){

    throw new Error(
      "缺少 GitHub token，无法同步到远程仓库"
    );

  }


  const path =
    `archive/${item.id}.json`;


  const contentBase64 =
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
            "application/json",

        },


        body:JSON.stringify({

          message:
            `archive: add ${item.title}`,

          content:
            contentBase64,

          branch:
            "main",

        })

      }
    );


  if(!response.ok){

    const error =
      await response.json();


    throw new Error(
      error.message ||
      "GitHub API error"
    );

  }


  return response;

}
