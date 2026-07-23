import fs from "fs";
import path from "path";
import matter from "gray-matter";


const dir =
"./content/archive";


const files =
fs.readdirSync(dir);



const result =
files
.filter(
f=>f.endsWith(".md")
)
.map(file=>{


const text =
fs.readFileSync(
path.join(dir,file),
"utf8"
);


const parsed =
matter(text);


return {


...parsed.data,


file:
`/content/archive/${file}`


}


});



fs.mkdirSync(
"./public/data",
{
recursive:true
}
);



fs.writeFileSync(

"./public/data/archive-index.json",

JSON.stringify(
result,
null,
2
)

);
