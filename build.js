const fs = require('fs');
var childProcess = require('child_process');

const sourceDir = "./source/";

fs.readdirSync(sourceDir,{withFileTypes: true}).forEach(item => {
  if(item.isDirectory)
  {
      const dir=sourceDir+item.name;
      const opath="./output/"+item.name+".json";
      childProcess.spawnSync('node',["build_dir",dir,opath],{
        stdio: [ 'ignore', process.stdout, process.stderr ],
      } );
  }

});