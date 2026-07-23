export async function loadDiscussionsCache(){

  const response =
    await fetch(
      "./data/discussions.json",
      {
        cache:"no-store"
      }
    );


  if(!response.ok){

    throw new Error(
      "Discussion cache unavailable"
    );

  }


  const data =
    await response.json();


  return data;

}
