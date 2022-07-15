var { ObjectId } = require("mongodb");

const express = require("express");
const router = express.Router();
var formidable = require('formidable');
const path = require('path');
const fs = require('fs');

const moveFile=(fileNames,file)=>{
    fileNames.push(file.newFilename)
    let oldPath = file.filepath
    let newPath = path.join(__dirname + "/public/") + file.newFilename;
    let rawData = fs.readFileSync(oldPath);
    fs.writeFileSync(newPath, rawData,(er)=>{})
}

router.post('/',async(req,res)=>{
    const form = formidable({ multiples: true, keepExtensions: true });
    let names=[]
    form.parse(req, async (err, fields, files) => {
        
      for(i=0;i<files.image.length;i++)
      moveFile(names,files.image[i])
      for(i=0;i<files.test.length;i++)
      moveFile(names,files.test[i])
      
  })

})


module.exports = router;