var fs = require('fs');
var path = require("path");

//Functions to pull the directorys from a given location
function GetFoldersAndFiles(dir)
{
    return fs.readdirSync(dir)
        .filter(function (file)
        {
          return fs.statSync(path.join(dir, file));
      });
}

// Exporting the plugins main function
module.exports = GetFoldersAndFiles;