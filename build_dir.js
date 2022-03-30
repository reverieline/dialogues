const fs = require('fs');

if(process.argv.length!=4)
    throw 'usage: node build_dir dir ouput';
const sourceDir = process.argv[2];
const outputPath = process.argv[3];

let collection={};

fs.readdirSync(sourceDir).forEach(file => {
  const id=file.split('.')[0];

  let stage=0;
  let titles={};
  let dialogues={};
  fs.readFileSync(sourceDir+"/"+file, 'utf-8').split(/\r?\n/).forEach(function(line){
      if(line==0){
          stage=1;
      }else {
          line=line.replace(/\s{2,}/i,' ');
          line=line.replace(/\s+$/i,'');

          const di=line.indexOf(":");
          if(di<0)throw "Line without colon";
          const lang=line.substring(0,di);
          const text=line.substring(di+2);

          if(stage==0){
              titles[lang]=text;
          }else if(stage==1){
              if(dialogues[lang]==undefined){
                  dialogues[lang]=[];
              }
              dialogues[lang].push(text);
          }
    }
  });
  
  let lines=[];
  for(const [lang,l] of Object.entries(dialogues)){
      for(const [i,t] of Object.entries(l)){
        if(lines.length<=i)
            lines.push({});
        lines[i][lang]=t;
      }
  }

  collection[id]={
      titles: titles,
      lines: lines,
  }
});

fs.writeFileSync(outputPath,JSON.stringify(collection));