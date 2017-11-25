/*
* Author: Suman Barick
*/
const fs = require('fs');
const path = require('path');
const CryptoJS = require("crypto-js");
var AES = require("crypto-js/aes")
const key = "_S6h1K!N8c$7FkM-W#92yTix$@X9sZ";
var resultantFileList = [];

function start() {
    var filelist, 
        src = "/media/lubuntu/Study/Codes/bitbucket/skillseval/skillseval/skillseval/www/devData";

    filelist = walkSync(src, filelist);
    processData(filelist);
    generateReport(resultantFileList);

    console.log("Process complete...");
}


/*
* This function processes all the files in devData
* and creates processed file in data folder under same root
*/
const processData = (filelist) => {

    filelist.map(function(src) {

        //if file is index.json, 
        //then Encrypt it, 
        //Name it index.enc.json
        if(src.endsWith("index.json")) {
            createEncryptedFile(src);
        }

        //if the file is a <fileName>.qa.json
        //Then, Encode the answer to key
        //Then, Encrypt the file
        //Name it <fileName>.qa.enc.json
        else if(src.endsWith(".qa.json")) {
            var questionsArray = JSON.parse(fs.readFileSync(src));
            //console.log(questionsArray);
            questionsArray = JSON.stringify(encryptAnswers(questionsArray));
            var encContents = {"enc": AES.encrypt(questionsArray, key).toString()};
            var dest = src.replace("/devData/", "/data/").replace(".json", ".enc.json");
            writeToFile(dest, JSON.stringify(encContents));

            var fObj = {
                "src": src.toString(),
                "dest": dest.toString()
            };

            resultantFileList.push(fObj);
        }
    });
}


const createEncryptedFile = (filePath) => {
    var contents = fs.readFileSync(filePath).toString();
    contents = {"enc": AES.encrypt(contents, key).toString()};

    var dest = filePath.replace("/devData/", "/data/").replace(".json", ".enc.json");
    writeToFile(dest, JSON.stringify(contents));

    //console.log(filePath);

    var fObj = {
        "src": filePath.toString(),
        "dest": dest.toString()
    };

    resultantFileList.push(fObj);
}


/*
* This function recurively lists all the files under root folder "dir"
* and Puts them in filelist and returns filelist
*/
const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {

    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file));

    });
    return filelist;
}


/*
* This generates the html report for the files that have been processed
*/
const generateReport = (resultFileObj) => {
    //console.log(resultFileObj);
    var htm = '<link rel="stylesheet" type="text/css" href="style.css">';
    htm += '<table id="report-table">';

    resultFileObj.map(function(f) {
        htm += '<tr>'
            +       '<td>' + f.src + '</td>'
            +       '<td>' + f.dest + '</td>'
            +   '</tr>'
    });

    htm += '</table>';

    var reportFileName = "./report.html";

    writeToFile(reportFileName, htm);
} 


/*
* This function writes given content to the given fileName
*/
const writeToFile = (fileName, content) => {
    fs.writeFile(fileName, content, function(err) {
        if(err) {
            return console.log(err);
        }

        //console.log("File written successfully. File name = " + fileName);
    }); 
}


/*
* Loop thru all the questions and encrypt their answers
*/
function encryptAnswers(qas) {
    qas.forEach(qa => {
        //skip if already encrypted
        if(qa.ans.trim().length > 1) {
            return;
        }
        var key = createEncryptedKey(qa.ans);

        //check if decryption actually gives back the same result
        if(decryptKey(key) === qa.ans) {
            delete qa.ans;
            qa.key = key;
        }
        else {
            console.log("**************************************");
            console.log("Decryption didnot give the same result");
            console.log("key = " + key);
            console.log("real ans = " + qa.ans);
            console.log("decrypted ans = " + decryptKey(key));
            console.log("**************************************");
        }
    });

    return qas;
}

/*
* 1. Call createRandomKey to get NNNNNNNNNN-NNNNNNNNNN-XXXXXXXXXXXXXXXXXXXX
* 2. follow the code
* 
*/
function createEncryptedKey (ans) {
    var splitted = createRandomKey().split('-');
    var firstNString = splitted[0];
    var secondNString = splitted[1];
    var alphaString = splitted[2];

    //Create ultimateIndex where we can hide ans amongst alphanum
    var ultimateIndex = parseInt(secondNString[firstNString[3]]) + parseInt(secondNString[firstNString[6]]) + parseInt(secondNString[firstNString[9]]);

    //the index should not go beyond (alphaString.length-1)
    ultimateIndex = ultimateIndex % (alphaString.length-1);

    //hide the ans in ultimateIndex of alphaString
    //since Strings are immutable, we need to change it to array 
    //put the ans and change back
    alphaString = alphaString.split('');
    alphaString[ultimateIndex] = ans;
    alphaString = alphaString.join('');

    //now redocorate the string so that it looks like 
    // 5things hyphen 5things hyphen so on
    var onestring = firstNString + secondNString + alphaString;

    var res = "";

    for (var i=0; i < onestring.length; i++) {
        if (i !== 0 && i % 5 === 0) {
           res += '-'; 
        }

        res += onestring[i];
    }

    return res;
}

/*
* Random key will be like
* 10 num - 10 num - 20 alphanum
* NNNNNNNNNN-NNNNNNNNNN-XXXXXXXXXXXXXXXXXXXX
*/
var alpha = ['A', 'B', 'C', 'D', 'E', 'F'];
function createRandomKey () {
    var rkey = '';

    //Create the Numeric part
    for (var i=0; i <= 20; i++) {
        //10th index will be the hyphen '-'
        if (i===10) {
            rkey += "-";
            continue;
        }

        rkey += Math.floor(Math.random() * 10);
    }

    rkey += '-';

    //Create the alphanumeric part
    for (var j=0; j<20; j++) {

        //randomly decide if number or alpha
        if (Math.floor(Math.random() * 100) % 2 === 0) {
            //put a number
            rkey += Math.floor(Math.random() * 10);
        }
        else {
            //put an alpha
            rkey += alpha[Math.floor(Math.random() * alpha.length)];
        }
    }

    return rkey;
}


/*
* Let N=Number, X=AlphaNumeric
* This function will take 1 key in the format
* NNNNN-NNNNN-NNNNN-NNNNN-XXXXX-XXXXX-XXXXX-XXXXX
* And follow the code
*/
function decryptKey (key) {
    var splitted = key.split('-');
    var firstNString = splitted[0] + splitted[1];
    var secondNString = splitted[2] + splitted[3];
    var alphaString = splitted[4] + splitted[5] + splitted[6] + splitted[7];

    //Create ultimateIndex where we can hide ans amongst alphanum
    var ultimateIndex = parseInt(secondNString[firstNString[3]]) + parseInt(secondNString[firstNString[6]]) + parseInt(secondNString[firstNString[9]]);

    //the index should not go beyond (alphaString.length-1)
    ultimateIndex = ultimateIndex % (alphaString.length-1);

    var ans = alphaString[ultimateIndex];

    return ans;
}


start();

// console.log(walkSync(src, filelist));/

