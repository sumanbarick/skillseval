/*
* Author: Suman Barick
*/

const rootFolderPath = process.argv[2] + "/";
const fs = require('fs');
const CryptoJS = require("crypto-js");
var AES = require("crypto-js/aes")
const key = "_S6h1K!N8c$7FkM-W#92yTix$@X9sZ";

//console.log("rootFolderPath = " + rootFolderPath);

fs.readdir(rootFolderPath, (err, files) => {
    if (err) {
        console.log(err);
        return;
    }

    var contents;
    var filePath;
    files.forEach(file => {
        //if already encrypted file, then skip it
        if (file.indexOf(".enc") > -1) {
            return;
        }
        filePath = rootFolderPath + file;

        if(!fs.lstatSync(filePath).isFile()) {
            return;
        }
        contents = fs.readFileSync(filePath).toString();
        contents = {"enc": AES.encrypt(contents, key).toString()};
        createEncryptedFile(filePath, contents);
    });    
});


/*
* Create a file with same name with appending prod
* a.json should be a.prod.json
*/
function createEncryptedFile (orignialPath, content) {
    var path = orignialPath.split('').reverse().join('').substr(5).split('').reverse().join('') + '.enc.json';

    fs.writeFile(path, JSON.stringify(content), function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("Done...");
    }); 
}