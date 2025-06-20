const path=require ("path");
const { exec }= require("child_process");

const executeJava=(filePath) => {
    const dir= path.dirname(filePath);
    const jobId= path.basename(filePath).split(".")[0];

    return new Promise((resolve,reject)=>{
        exec(`javac "${filePath}" && java -cp "${dir}" ${jobId}`,(error,stdout,stderr)=> {
            if(error) return reject({error :stderr});
            resolve(stdout);

        });
    });
};

module.exports={executeJava};