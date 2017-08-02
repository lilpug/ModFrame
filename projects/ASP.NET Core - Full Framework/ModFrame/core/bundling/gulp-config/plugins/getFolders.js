var fs = require('fs');
var path = require("path");

//Functions to pull the directorys from a given location
function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function (file) {
          return fs.statSync(path.join(dir, file)).isDirectory();
      });
}

// Exporting the plugins main function
module.exports = getFolders;