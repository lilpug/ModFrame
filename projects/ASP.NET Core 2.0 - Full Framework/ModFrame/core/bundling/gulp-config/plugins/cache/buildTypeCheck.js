var fs = require('fs');
var path = require("path");
var mkdirp = require('mkdirp');
var del = require("del");
var path = require("path");

//personal plugins
var exists = require("../exists");

//This function checks if the build type is different than the previous process, if so then it deletes them all so they will be regenerated
function BuildTypeCheck(buildType, compiledDirectory, cacheBase, buildName, typeName)
{
    var buildTypeStatus = false;

    if (!exists(cacheBase))
    {
        //Creates the directory if its not already created
        mkdirp.sync(cacheBase);
        buildTypeStatus = true;
    }

    if (!exists(path.join(cacheBase, buildName)))
    {
        //Creates the directory if its not already created
        mkdirp.sync(path.join(cacheBase, buildName));
        buildTypeStatus = true;
    }

    //Checks if the build type base cache folder exists
    if (!exists(path.join(cacheBase, buildName, typeName)) || fs.readFileSync(path.join(cacheBase, buildName, typeName), "utf8") != buildType)
    {
        buildTypeStatus = true;
    }

    //If the flag is activated delete all the current compiled stuff ready for the new build type versions
    if (buildTypeStatus)
    {
        //Removes the compiled directory
        del.sync(path.join(compiledDirectory));

        //Cache remove
        del.sync(path.join(cacheBase, typeName));//Cache list

        //Creates the new debug cache file
        fs.writeFile(path.join(cacheBase, buildName, typeName), buildType);
    }
}

// Exporting the plugins main function
module.exports = BuildTypeCheck;