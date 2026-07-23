import fs from "fs";
import path from "path";


const owner = "Singerxushi";
const repo = "anima-archive";


const query = `
query {
  repository(
    owner:"${owner}"
    name:"${repo}"
  ){

    discussions(
      first:50
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



async function main(){


  const token =
    process.env.GITHUB_TOKEN;



  if(!token){

    throw new Error(
      "Missing GITHUB_TOKEN"
    );

  }



  const response =
    await fetch(
      "https://api.github.com/graphql",
      {

        method:"POST",

        headers:{

          Authorization:
            `bearer ${token}`,

          "Content-Type":
            "application/json"

        },


        body:
          JSON.stringify({
            query
          })

      }
    );



  const json =
    await response.json();



  if(json.errors){

    throw new Error(
      JSON.stringify(json.errors)
    );

  }



  const discussions =
    json.data.repository.discussions.nodes;



  const output = {

    updatedAt:
      new Date().toISOString(),

    source:
      "github-discussions",

    discussions

  };



  const file =
    path.resolve(
      "public/data/discussions.json"
    );


  fs.mkdirSync(
    path.dirname(file),
    {
      recursive:true
    }
  );



  fs.writeFileSync(
    file,
    JSON.stringify(
      output,
      null,
      2
    )
  );



  console.log(
    `Saved ${discussions.length} discussions`
  );

}



main();
