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
		//console.log(file);
        if (file.indexOf("mighty") > -1) {
            return;
        }
		filePath = rootFolderPath + file;
		contents = JSON.parse(fs.readFileSync(filePath));
        //console.log("contents");
        //console.log(contents);
		combined = combined.concat(contents);
        //console.log("contents");
        //console.log(contents);
	});

	//Finally write to a combined json file
	fs.writeFile(rootFolderPath + "/mighty.json", JSON.stringify(combined), function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    console.log("Done...");
	}); 

});