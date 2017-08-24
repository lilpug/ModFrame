//Gulp plugin extensions
var del = require("del");
var path = require("path");

//personal plugins
var Exists = require("./Exists");
var GetFileTypeExist = require("./GetFileTypeExist");
var GetFolders = require("./GetFolders");

//This function deals with cleaning the js and css structures
function CleanStructureSingleLayer(originalDirectory, compiledDirectory, extensionType) {
    //Checks if the folder exists, if so goes into it to check if there is any obsolete files or directories
    if (Exists(path.join(originalDirectory, extensionType)) && Exists(path.join(compiledDirectory, extensionType)))
    {
        //Checks if the base files exist
        var realBaseFiles = GetFileTypeExist(path.join(originalDirectory, extensionType), "." + extensionType, false);

        //Checks the base directory file
        if (!realBaseFiles && Exists(path.join(compiledDirectory, extensionType, 'min.' + extensionType)))
        {
            del.sync(path.join(compiledDirectory, extensionType, '*.' + extensionType));            
        }

        //Loops over the sub folders
        var secondFolders = GetFolders(path.join(compiledDirectory, extensionType));
        var t2 = secondFolders.map(function (secondFolder) {
            //Checks if the sub folder exists in both the compiled and original version and ensures it not empty
            //NOTE: Only check directories that exist, some might not have been compiled yet so we ignore them
            if (Exists(path.join(originalDirectory, extensionType, secondFolder)) && Exists(path.join(compiledDirectory, extensionType, secondFolder))) {

                var thirdFolders = GetFolders(path.join(compiledDirectory, extensionType, secondFolder));
                var t3 = thirdFolders.map(function (thirdFolder) {
                    if (Exists(path.join(originalDirectory, extensionType, secondFolder, thirdFolder)) && Exists(path.join(compiledDirectory, extensionType, secondFolder, thirdFolder))) {
                        //Checks if files exist in this directory
                        var realFiles = GetFileTypeExist(path.join(originalDirectory, extensionType, secondFolder, thirdFolder), "." + extensionType, true);

                        //Checks if no files were found but the files compiled version still exists, if so deletes it
                        if (!realFiles && Exists(path.join(compiledDirectory, extensionType, secondFolder, thirdFolder)))
                        {
                            del.sync(path.join(compiledDirectory, extensionType, secondFolder, thirdFolder, "**"));                            
                        }
                    }
                    else if (Exists(path.join(compiledDirectory, extensionType, secondFolder, thirdFolder)))
                    {
                        //does not exist on the original but is still in the compiled so delete it
                        del.sync(path.join(compiledDirectory, extensionType, secondFolder, thirdFolder, "**"));                        
                    }
                });

                //Checks if files exist in this directory
                var realFiles = GetFileTypeExist(path.join(originalDirectory, extensionType, secondFolder), "." + extensionType, false);

                //Removes the min file on the second folder if it no longer exists
                if (!realFiles)
                {
                    del.sync(path.join(compiledDirectory, extensionType, secondFolder, "*." + extensionType));

                    //After deleting checks if there is still files in this particular folder
                    realFiles = GetFileTypeExist(path.join(originalDirectory, extensionType, secondFolder), "." + extensionType, false);
                }

                //Pulls the folders again to check if we have any still now we have processed through them
                var thirdFolderCheck = GetFolders(path.join(compiledDirectory, extensionType, secondFolder));

                //Checks if no files were found but the files compiled version still exists, if so deletes it
                if (thirdFolderCheck.length <= 0 && !realFiles && Exists(path.join(compiledDirectory, extensionType, secondFolder)))
                {
                    del.sync(path.join(compiledDirectory, extensionType, secondFolder));                    
                }
            }
            else if (Exists(path.join(compiledDirectory, extensionType, secondFolder)))
            {
                //does not exist on the original but is still in the compiled so delete it
                del.sync(path.join(compiledDirectory, extensionType, secondFolder));                
            }
        });

        //Removes the parent sub folder if no sub folder exist any longer within it                    
        var newFileExist = GetFileTypeExist(path.join(originalDirectory, extensionType), "." + extensionType, true);
        if (!newFileExist && Exists(path.join(compiledDirectory, extensionType)))
        {
            del.sync(path.join(compiledDirectory, extensionType));            
        }
    }
    else if (Exists(path.join(compiledDirectory, extensionType)))
    {
        //does not exist on the original but is still in the compiled so delete it
        del.sync(path.join(compiledDirectory, extensionType));            
    }
}

// Exporting the plugins main function
module.exports = CleanStructureSingleLayer;