var fs = require('fs');
var path = require("path");
var mkdirp = require('mkdirp');

//personal plugins
var exists = require("../exists");

//Function to return a list of files from a directory with a specific file extension
function getFileList(dir, filterExtension, recursive) {
    var fileList = [];
    var list = fs.readdirSync(dir)

    for (var i = 0; i < list.length; i++) {
        var file = list[i];
        file = dir + '/' + file
        var stat = fs.statSync(file)
        if (stat && stat.isDirectory() && recursive) {
            fileList = fileList.concat(getFileList(file, filterExtension, recursive));
        }
        else {
            if (file.indexOf(filterExtension) > -1) {
                fileList.push(file);
            }
        }
    }
    return fileList;
};

//false = 100% needs regenerating
//true = everything is the same
function fileChecker(dir, filterExtension, recursive, listBasePath, listName) {
    //Gets a list of files from the passed directory with the specified extension
    var files = getFileList(dir, filterExtension, recursive);

    //If file list is empty then we need to generate it all so skip checks and write the file for next time
    if (exists(listBasePath) && exists(path.join(listBasePath, listName))) {
        //Gets the content of the currently stored list
        var content = fs.readFileSync(path.join(listBasePath, listName), 'utf8');

        //Converts the string read in to an array format
        var listArray = content.split(",");

        //Checks if the current array is the same as the one stored.
        if (listArray.length == files.length &&
            listArray.every(function (u, i) {
                return u === files[i];
        })
        ) {
        }
        else//If the results are different then rewrite the file and send off a regeneration signal
        {
            fs.writeFile(path.join(listBasePath, listName), files);
            return false;
        }
    }
    else//no file
    {
        //If there is some files to actually generate this time
        if (files.length > 0)
        {
            //Create the structure
            if (!exists(listBasePath))
            {
                //Creates the directories if they are not created already
                mkdirp.sync(listBasePath);
            }

            //Writes the new file
            fs.writeFile(path.join(listBasePath, listName), files);
            return false;
        }
    }

    return true;
}

// Exporting the plugins main function
module.exports = fileChecker;