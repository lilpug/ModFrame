//Gulp plugin extensions
var del = require("del");
var path = require("path");

//personal plugins
var exists = require("../exists");
var getFileTypeExist = require("../getFileTypeExist");
var getFolders = require("../getFolders");

//This function deals with cleaning the js and css structures
function CleanStructureSingleLayer(originalDirectory, compiledDirectory, cacheDirectory, extensionType) {
    //Checks if the folder exists, if so goes into it to check if there is any obsolete files or directories
    if (exists(path.join(originalDirectory, extensionType)) && exists(path.join(compiledDirectory, extensionType))) {
        //Checks if the base files exist
        var realBaseFiles = getFileTypeExist(path.join(originalDirectory, extensionType), "." + extensionType, false);

        //Checks the base directory file
        if (!realBaseFiles && exists(path.join(compiledDirectory, extensionType, 'min.' + extensionType))) {
            del.sync(path.join(compiledDirectory, extensionType, '*.' + extensionType));
            del.sync(path.join(cacheDirectory, extensionType, "base"));//Cache list
        }

        //Loops over the sub folders
        var secondFolders = getFolders(path.join(compiledDirectory, extensionType));
        var t2 = secondFolders.map(function (secondFolder) {
            //Checks if the sub folder exists in both the compiled and original version and ensures it not empty
            //NOTE: Only check directories that exist, some might not have been compiled yet so we ignore them
            if (exists(path.join(originalDirectory, extensionType, secondFolder)) && exists(path.join(compiledDirectory, extensionType, secondFolder))) {

                var thirdFolders = getFolders(path.join(compiledDirectory, extensionType, secondFolder));
                var t3 = thirdFolders.map(function (thirdFolder) {
                    if (exists(path.join(originalDirectory, extensionType, secondFolder, thirdFolder)) && exists(path.join(compiledDirectory, extensionType, secondFolder, thirdFolder))) {
                        //Checks if files exist in this directory
                        var realFiles = getFileTypeExist(path.join(originalDirectory, extensionType, secondFolder, thirdFolder), "." + extensionType, true);

                        //Checks if no files were found but the files compiled version still exists, if so deletes it
                        if (!realFiles && exists(path.join(compiledDirectory, extensionType, secondFolder, thirdFolder))) {
                            del.sync(path.join(compiledDirectory, extensionType, secondFolder, thirdFolder, "**"));
                            del.sync(path.join(cacheDirectory, extensionType, secondFolder));//Cache list
                        }
                    }
                    else if (exists(path.join(compiledDirectory, extensionType, secondFolder, thirdFolder))) {
                        //does not exist on the original but is still in the compiled so delete it
                        del.sync(path.join(compiledDirectory, extensionType, secondFolder, thirdFolder, "**"));
                        del.sync(path.join(cacheDirectory, extensionType, "base-" + secondFolder + "-" + thirdFolder));//Cache list
                    }
                });

                //Checks if files exist in this directory
                var realFiles = getFileTypeExist(path.join(originalDirectory, extensionType, secondFolder), "." + extensionType, false);

                //Removes the min file on the second folder if it no longer exists
                if (!realFiles)
                {
                    del.sync(path.join(compiledDirectory, extensionType, secondFolder, "*." + extensionType));

                    //After deleting checks if there is still files in this particular folder
                    realFiles = getFileTypeExist(path.join(originalDirectory, extensionType, secondFolder), "." + extensionType, false);
                }

                //Pulls the folders again to check if we have any still now we have processed through them
                var thirdFolderCheck = getFolders(path.join(compiledDirectory, extensionType, secondFolder));

                //Checks if no files were found but the files compiled version still exists, if so deletes it
                if (thirdFolderCheck.length <= 0 && !realFiles && exists(path.join(compiledDirectory, extensionType, secondFolder))) {
                    del.sync(path.join(compiledDirectory, extensionType, secondFolder));
                    del.sync(path.join(cacheDirectory, extensionType, "base-" + secondFolder));//Cache list
                }
            }
            else if (exists(path.join(compiledDirectory, extensionType, secondFolder))) {
                //does not exist on the original but is still in the compiled so delete it
                del.sync(path.join(compiledDirectory, extensionType, secondFolder));
                del.sync(path.join(cacheDirectory, extensionType, "base-" + secondFolder));//Cache list
            }
        });

        //Removes the parent sub folder if no sub folder exist any longer within it                    
        var newFileExist = getFileTypeExist(path.join(originalDirectory, extensionType), "." + extensionType, true);
        if (!newFileExist && exists(path.join(compiledDirectory, extensionType))) {
            del.sync(path.join(compiledDirectory, extensionType));
            del.sync(path.join(cacheDirectory, extensionType));//Cache list
        }
    }
    else if (exists(path.join(compiledDirectory, extensionType))) {
        //does not exist on the original but is still in the compiled so delete it
        del.sync(path.join(compiledDirectory, extensionType));
        del.sync(path.join(cacheDirectory, extensionType));//Cache list                    
    }
}

// Exporting the plugins main function
module.exports = CleanStructureSingleLayer;