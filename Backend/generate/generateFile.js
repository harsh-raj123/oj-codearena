const fs= require("fs");
const path= require("path");
const { v4:uuid }=require("uuid");



const dirCodes=path.join(__dirname,"codes");//C:\Users\KIIT\Desktop\Compiler\codes

if(!fs.existsSync(dirCodes)){
    fs.mkdirSync(dirCodes,{recursive:true});
}

const generateFile=(language,code) =>{
    let filename;
    if(language === "java"){
        const match= code.match(/public\s+class\s+([A-Za-z_][A-Za-z0-9_]*)/);
        if(!match){
            throw new Error("Java class name not founfd");
        }
        filename =`${match[1]}.java`
    }else{
    const jobId = uuid();
    filename = `${jobId}.${language}`;
    }
    const filePath = path.join(dirCodes, filename);

    fs.writeFileSync(filePath, code);

    return filePath;
};

module.exports ={
    generateFile
}