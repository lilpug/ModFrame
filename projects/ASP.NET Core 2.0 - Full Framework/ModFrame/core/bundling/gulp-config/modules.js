//Gulp plugin extensions
var gulp = require('gulp');  
var del = require("del");
var path = require("path");
var chokidar = require('chokidar');

//personal plugins
var env = require("./plugins/enviroment");
var CacheBuildTypeCheck = require("./plugins/CacheBuildTypeCheck");
var Exists = require("./plugins/Exists");
var GetFolders = require("./plugins/GetFolders");
var ConAndMinMultiLayer = require("./plugins/ConAndMinMultiLayer");
var CleanStructureMultiLayer = require("./plugins/CleanStructureMultiLayer");

//The hosting file path
var hosting = "./wwwroot";

//Variables used for the directory paths etc
var compiledDirectory = path.join(hosting, 'components', 'modules');
var originalDirectory = './modules';
var folderName = "modules";
var cacheBasePath = "./modframe/core/bundling/gulp-config/cache-store";
var cacheBuildTypeName = "build-types";

//Sets up the watcher for file changes in the css and js files
gulp.task('modules-watch', function ()
{
    //Stores the directories to watch
    var watchJSPath = path.join(originalDirectory, '**/**/js/**/*.js');
    var watchCSSPath = path.join(originalDirectory, '**/**/css/**/*.css');
	var watchLessPath = path.join(originalDirectory, '**/**/css/**/*.less');
	var watchSassPath = path.join(originalDirectory, '**/**/css/**/*.scss');
    
    chokidar.watch([watchJSPath, watchCSSPath, watchLessPath, watchSassPath], { ignoreInitial: true, depth: 5 })
        .on('all', function (event, path)
        {
            //Triggers the clean just in case files have been deleted or renamed etc
            gulp.start(["modules-clean"]);

            //Triggers the update method
            if (env.isDevelopment()) {
                gulp.start(['debug-modules']);
            }
            else {
                gulp.start(['modules']);
            }
        })
        .on('error', function () {
            //Note: it often breaks on windows when deleting a folder its watching on, so catch it so the watcher does not die and clean up.
            //Triggers the clean just in case files have been deleted or renamed etc
            gulp.start(["modules-clean"]);
        });
});


//This checks which files need deleting based on what exists on the main directory
//Note: this function has a lot of exist checks in case multiple functions get fired at once so we don't duplicate or cause errors.
gulp.task('modules-clean', function ()
{
    //Checks if the directory has been compiled and the original exists, otherwise there is no point trying to check for deletes etc.
    if (Exists(originalDirectory) && Exists(compiledDirectory))
    {
        //Gets all the folders in the directory
        var baseFolders = GetFolders(originalDirectory);

        //Gets all the folders in the directory
        var compiledFolders = GetFolders(compiledDirectory);
        
        //Deletes any group and sub layer structure that does not exist in the uncompiled versions
        var compiledFolderChecks = compiledFolders.map(function (folder)
        {
            //Checks if the folder does not exist within the uncompiled version, if so removes it as its obsolete
            if (!Exists(path.join(originalDirectory, folder)))
            {
                del.sync(path.join(compiledDirectory, folder));                
            }
            else
            {
                //Deletes any group sub layer structures that do not exist in the uncompiled version
                var subLayerFolders = GetFolders(path.join(compiledDirectory, folder))
                var subFolderChecks = subLayerFolders.map(function (subFolder)
                {
                    //Checks if the folder does not exist within the uncompiled version, if so removes it as its obsolete
                    if (!Exists(path.join(originalDirectory, folder, subFolder)))
                    {
                        del.sync(path.join(compiledDirectory, folder, subFolder));                        
                    }

                    //If it exists in the original location and it exists in the compiled location check the inner folders
                    else
                    {
                        //Gets all the inner folders in the 
                        var innerFolders = GetFolders(path.join(compiledDirectory, folder, subFolder));
                        var tasks = innerFolders.map(function (innerFolder)
                        {
                            //Checks if the inner folder does not exist within the original location anymore
                            if (!Exists(path.join(originalDirectory, folder, subFolder, innerFolder)))
                            {
                                del.sync(path.join(compiledDirectory, folder, subFolder, innerFolder));                                
                            }
                        });
                    }
                });
            }
        });
        
        //Loops over all the parent folders and gets their sub layers within the module group
        var tasks = baseFolders.map(function (baseFolder)
        {
            //Runs the cleaning process for the inner js and css
            CleanStructureMultiLayer(GetFolders(path.join(originalDirectory, baseFolder)), path.join(originalDirectory, baseFolder), path.join(compiledDirectory, baseFolder), "js");
            CleanStructureMultiLayer(GetFolders(path.join(originalDirectory, baseFolder)), path.join(originalDirectory, baseFolder), path.join(compiledDirectory, baseFolder), "css");
        });
    
        //Checks if there are still any folders in the main directory now, if not then remove the parent directory as well
        var newFolders = GetFolders(compiledDirectory);
        if (newFolders.length <= 0 && Exists(compiledDirectory))
        {
            del.sync(compiledDirectory);            
        }
    }
    else if(Exists(compiledDirectory))
    {
        //does not exist on the original but is still in the compiled so delete it
        del.sync(compiledDirectory);        
    }
});

//Compiles all the personal plugin js and css in minified format split up into their corraspending plugin folders
gulp.task('modules', function ()
{
    //Only run if theres something to compile
    if (Exists(originalDirectory))
    {
        //Gets all the module groups in the directory
        var baseFolders = GetFolders(originalDirectory);

        //Checks if its a different build type to the previous build ran
        CacheBuildTypeCheck("release", compiledDirectory, cacheBasePath, cacheBuildTypeName, folderName);

        //Loops over all the parent folders and gets their sub layers within the module group
        var tasks = baseFolders.map(function (baseFolder) 
        {   
            //Conats and minifes the structures
            ConAndMinMultiLayer(GetFolders(path.join(originalDirectory, baseFolder)), path.join(originalDirectory, baseFolder), path.join(compiledDirectory, baseFolder), "js", false);
            ConAndMinMultiLayer(GetFolders(path.join(originalDirectory, baseFolder)), path.join(originalDirectory, baseFolder), path.join(compiledDirectory, baseFolder), "css", false);
        });
    }
});

//Compiles all the personal plugin js and css in minified format split up into their corraspending plugin folders
gulp.task('debug-modules', function () {
    //Only run if theres something to compile
    if (Exists(originalDirectory))
    {
        //Gets all the module groups in the directory
        var baseFolders = GetFolders(originalDirectory);

        //Checks if its a different build type to the previous build ran
        CacheBuildTypeCheck("debug", compiledDirectory, cacheBasePath, cacheBuildTypeName, folderName);

        //Loops over all the parent folders and gets their sub layers within the module group
        var tasks = baseFolders.map(function (baseFolder) {
            //Conats and minifes the structures
            ConAndMinMultiLayer(GetFolders(path.join(originalDirectory, baseFolder)), path.join(originalDirectory, baseFolder), path.join(compiledDirectory, baseFolder), "js", true);
            ConAndMinMultiLayer(GetFolders(path.join(originalDirectory, baseFolder)), path.join(originalDirectory, baseFolder), path.join(compiledDirectory, baseFolder), "css", true);
        });
    }
});