const {exec} =require("child_process");
const { error } = require("console");
const fs= require("fs");
const path=require("path");
const { stderr, stdout } = require("process");

const outputDir= path.join(__dirname,"..","generate","outputs");
if(!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir,{recursive:true});
}
const executeC = (filePath)=>{
    const jobId= path.basename(filePath).split(".")[0];
    const outPath= path.join(outputDir,`${jobId}.exe`);

    return new Promise((resolve, reject) => {
    exec(`gcc "${filePath}" -o "${outPath}" && "${outPath}"`, (error, stdout, stderr) => {
      if (error) return reject({ error: stderr });
      resolve(stdout);
    });
  });
};

module.exports= {executeC};