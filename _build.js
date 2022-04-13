const fs = require('fs');

function buildDir(path){
  const out=[];
  let index=null;
  try{index=require(path+'/index.js');}
  catch(e){return out;}

  for(const e of index){
    if( 'file'==e.type){
      out.push({
        ...e,
        path: path+'/'+e.path,
      });
    }
    if('dir'==e.type){
      let p=path+'/'+e.path;
      out.push({
        ...e,
        path: p,
        content: buildDir(p),
      });
    }
  }
  return out;
}

const out=buildDir('./_out');
console.log(out);
fs.writeFileSync('index.json',JSON.stringify(out));
