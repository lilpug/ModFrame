var fs = require('fs');

//Function to return whether or not a file type exists within a directory, it can work recursively from a directory and a file extension i.e. ".css"
function GetFileTypeExist(dir, filterExtension, recursive) {
    var flag = false;
    var list = fs.readdirSync(dir)

    for (var i = 0; i < list.length; i++) {
        //We have what we need
        if (flag) {
            break;
        }

        //Keep checking
        var file = list[i];
        file = dir + '/' + file
        var stat = fs.statSync(file)
        if (stat && stat.isDirectory() && recursive) flag = GetFileTypeExist(file, filterExtension, recursive);
        else {
            if (file.indexOf(filterExtension) > -1) {
                flag = true;
            }
        }
    }
    return flag;
};

// Exporting the plugins main function
module.exports = GetFileTypeExist;