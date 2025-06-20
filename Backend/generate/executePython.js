const {exec} =require ("child_process");

const executePython=(filePath) =>{
    return new Promise((resolve,reject) =>{
        exec(`python "${filePath}"`,(error, stdout, stderr)=>{
           if(error) return reject({ error:stderr});
           resolve(stdout);
        });

    });
};
module.exports={executePython};