/**
 * GitHub Discussions Cache Loader
 *
 * 数据来源:
 * GitHub Actions
 *
 * public/data/discussions.json
 */


export async function loadDiscussionsCache(){


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



  return {

    updatedAt:
      data.updatedAt || "",


    source:
      data.source ||
      "github-discussions-cache",


    discussions:
      data.discussions || []

  };

}
