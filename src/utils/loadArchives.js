import matter from "gray-matter";


const files = import.meta.glob(
  "../content/archives/*.md",
  {
    eager:true,
    query:"?raw",
    import:"default"
  }
);


export function loadArchives(){

return Object.entries(files).map(
([path,content])=>{

const {data,content:body}=matter(content);


return {

...data,

content:body,

file:path

};

});


}
