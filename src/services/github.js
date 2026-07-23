const OWNER =
  import.meta.env.VITE_GITHUB_OWNER ||
  "Singerxushi";

const REPO =
  import.meta.env.VITE_GITHUB_REPO ||
  "anima-archive";


/**
 * GitHub公开读取
 * 无token
 */

export async function fetchGithubFile(path){

    const url =
    `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/${path}`;

    const response =
    await fetch(url,{
        cache:"no-store"
    });


    if(!response.ok){
        throw new Error(
          "GitHub数据读取失败"
        );
    }


    return response.text();

}


/**
 * Discussions入口
 */

export function getDiscussionsURL(){

 return (
 `https://github.com/${OWNER}/${REPO}/discussions`
 );

}


/**
 * Journal投稿
 */


export function createJournalIssueURL(data){


const title =
encodeURIComponent(
`[Submission] ${data.title}`
);


const body =
encodeURIComponent(
`
## Author

${data.author}


## Abstract

${data.abstract}


## Keywords

${data.keywords}


## References

${data.references}


---
Submitted from Anima Archive
`
);


return (

`https://github.com/${OWNER}/${REPO}/issues/new`
+
`?title=${title}`
+
`&body=${body}`
+
`&labels=journal-submission`

);


}
