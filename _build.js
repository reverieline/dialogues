const fs = require('fs');
const os=require('os');

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

function preprocessTextFiles(dir){
  fs.readdirSync(dir,{withFileTypes:true}).forEach(file => {
    
    if(file.isDirectory()){
      preprocessTextFiles(dir+"/"+file.name);
    }else if(/\.txt$/gi.test(file.name)){
      let path=dir+"/"+file.name;
      console.log(path);
      let text=fs.readFileSync(path,{encoding:"utf8"}).toString();
      let outtext="";
      text.split(/\r?\n/).forEach(function(line){
        line=line.replace(/\s{2,}/gi,' ');
        line=line.replace(/\s+$/gi,'');
        line+=os.EOL;
        outtext+=line;
      });
            
      fs.writeFileSync(path,outtext);
    }
  });
}

preprocessTextFiles('./_out');
const out=buildDir('./_out');
fs.writeFileSync('index.json',JSON.stringify(out));
