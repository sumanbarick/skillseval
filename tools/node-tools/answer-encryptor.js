/*
* Author: Suman Barick
*/

const rootFolderPath = process.argv[2] + "/";
const fs = require('fs');
var combined = [];

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
        if (file.indexOf(".prod.json") > -1) {
            return;
        }
        filePath = rootFolderPath + file;
        contents = JSON.parse(fs.readFileSync(filePath));
        contents = encryptAnswer(contents);
        createProductionFile(filePath, contents);
    });    
});

/*
* Loop thru all the questions and encrypt their answers
*/
function encryptAnswer(qas) {
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


/*
* Create a file with same name with appending prod
* a.json should be a.prod.json
*/
function createProductionFile (orignialPath, content) {
    var path = orignialPath.split('').reverse().join('').substr(5).split('').reverse().join('') + '.prod.json';

    fs.writeFile(path, JSON.stringify(content), function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("Done...");
    }); 
}