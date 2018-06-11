//Gulp plugin extensions
var del = require("del");
var path = require("path");

//personal plugins
var Exists = require("./Exists");
var GetFileTypeExist = require("./GetFileTypeExist");
var GetFolders = require("./GetFolders");

//This function deals with cleaning the js and css structures
function CleanStructureMultiLayer(baseFolders, originalDirectory, compiledDirectory, extensionType)
{
    //Loops over the sub folders checking each folder for obsolete files and directories.
    var CompiledFileChecks = baseFolders.map(function (folder)
    {
        //Only check directories that exist, some might not have been compiled yet so we ignore them
        if (Exists(path.join(compiledDirectory, folder)))
        {
            //Checks if the folder exists, if so goes into it to check if there is any obsolete files or directories
            if (Exists(path.join(originalDirectory, folder, extensionType)) && Exists(path.join(compiledDirectory, folder, extensionType)))
            {
                //Checks if the base files exist
                var realBaseFiles = GetFileTypeExist(path.join(originalDirectory, folder, extensionType), "." + extensionType, false);

                //Checks the base directory file
                if (!realBaseFiles && Exists(path.join(compiledDirectory, folder, extensionType, 'min.' + extensionType)))
                {
                    del.sync(path.join(compiledDirectory, folder, extensionType, '*.' + extensionType));                    
                }

                //Loops over folders within the sub folder
                var secondFolders = GetFolders(path.join(compiledDirectory, folder, extensionType));
                var t2 = secondFolders.map(function (secondFolder) {
                    //Checks if the sub folder exists in both the compiled and original version and ensures it not empty
                    //NOTE: Only check directories that exist, some might not have been compiled yet so we ignore them
                    if (Exists(path.join(originalDirectory, folder, extensionType, secondFolder)) && Exists(path.join(compiledDirectory, folder, extensionType, secondFolder))) {

                        var thirdFolders = GetFolders(path.join(compiledDirectory, folder, extensionType, secondFolder));
                        var t3 = thirdFolders.map(function (thirdFolder) {
                            if (Exists(path.join(originalDirectory, folder, extensionType, secondFolder, thirdFolder)) && Exists(path.join(compiledDirectory, folder, extensionType, secondFolder, thirdFolder))) {
                                //Checks if files exist in this directory
                                var realFiles = GetFileTypeExist(path.join(originalDirectory, folder, extensionType, secondFolder, thirdFolder), "." + extensionType, true);

                                //Checks if no files were found but the files compiled version still exists, if so deletes it
                                if (!realFiles && Exists(path.join(compiledDirectory, folder, extensionType, secondFolder, thirdFolder)))
                                {
                                    del.sync(path.join(compiledDirectory, folder, extensionType, secondFolder, thirdFolder, "**"));                                    
                                }
                            }
                            else if (Exists(path.join(compiledDirectory, folder, extensionType, secondFolder, thirdFolder)))
                            {
                                //does not exist on the original but is still in the compiled so delete it
                                del.sync(path.join(compiledDirectory, folder, extensionType, secondFolder, thirdFolder, "**"));                                
                            }
                        });

                        //Checks if files exist in this directory
                        var realFiles = GetFileTypeExist(path.join(originalDirectory, folder, extensionType, secondFolder), "." + extensionType, false);

                        //Removes the min file on the second folder if it no longer exists
                        if (!realFiles) {
                            del.sync(path.join(compiledDirectory, folder, extensionType, secondFolder, "*." + extensionType));

                            //After deleting checks if there is still files in this particular folder
                            realFiles = GetFileTypeExist(path.join(originalDirectory, folder, extensionType, secondFolder), "." + extensionType, false);
                        }

                        //Pulls the folders again to check if we have any still now we have processed through them
                        var thirdFolderCheck = GetFolders(path.join(compiledDirectory, folder, extensionType, secondFolder));

                        //Checks if no files were found but the files compiled version still exists, if so deletes it
                        if (thirdFolderCheck.length <= 0 && !realFiles && Exists(path.join(compiledDirectory, folder, extensionType, secondFolder)))
                        {
                            del.sync(path.join(compiledDirectory, folder, extensionType, secondFolder));                            
                        }
                    }
                    else if (Exists(path.join(compiledDirectory, folder, extensionType, secondFolder)))
                    {
                        //does not exist on the original but is still in the compiled so delete it
                        del.sync(path.join(compiledDirectory, folder, extensionType, secondFolder));                        
                    }
                });

                //Removes the parent folder if no sub folders exist any longer within it                    
                var newFileExists = GetFileTypeExist(path.join(originalDirectory, folder, extensionType), "." + extensionType, true);
                if (!newFileExists && Exists(path.join(compiledDirectory, folder, extensionType)))
                {
                    del.sync(path.join(compiledDirectory, folder, extensionType));                    
                }
            }
            else if (Exists(path.join(compiledDirectory, folder, extensionType)))
            {
                //does not exist on the original but is still in the compiled so delete it
                del.sync(path.join(compiledDirectory, folder, extensionType));                      
            }

            //Removes the parent folder if no sub folders exist any longer within it
            var newParentFolders = GetFolders(path.join(compiledDirectory, folder));
            if (newParentFolders.length <= 0 && Exists(path.join(compiledDirectory, folder)))
            {
                del.sync(path.join(compiledDirectory, folder));                
            }
        }
    });
}


//Exporting the plugins main function
module.exports = CleanStructureMultiLayer;