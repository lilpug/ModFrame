//Gulp plugin extensions
var gulp = require('gulp');
var del = require("del");
var path = require("path");
var chokidar = require('chokidar');

//personal plugins
var env = require("./plugins/enviroment");
var BuildTypeCheck = require("./plugins/cache/buildTypeCheck");
var exists = require("./plugins/exists");
var getFolders = require("./plugins/getFolders");
var ConAndMinMultiLayer = require("./plugins/cache/ConAndMinMultiLayer");
var CleanStructureMultiLayer = require("./plugins/cache/CleanStructureMultiLayer");

//The hosting file path
var hosting = "./wwwroot";

//Variables used for the directory paths etc
var compiledDirectory = path.join(hosting, 'components', 'layouts');
var originalDirectory = './layouts';
var folderName = "layout";
var cacheBasePath = "./modframe/core/bundling/gulp-config/cache-store";
var cacheBuildTypeName = "build-types";

//Sets up the watcher for file changes in the css and js files
gulp.task('layouts-watch', function ()
{
    //Stores the directories to watch
    var watchJSPath = path.join(originalDirectory, '**/js/**/*.js');
    var watchCSSPath = path.join(originalDirectory, '**/css/**/*.css');

    chokidar.watch([watchJSPath, watchCSSPath], { ignoreInitial: true, depth: 5 })
        .on('all', function (event, path)
        {
            //Triggers the clean just in case files have been deleted or renamed etc
            gulp.start(["layouts-clean"]);

            //Triggers the update method
            if (env.isDevelopment()) {
                gulp.start(['debug-layouts']);
            }
            else {
                gulp.start(['layouts']);
            }
        })
        .on('error', function () {
            //Note: it often breaks on windows when deleting a folder its watching on, so catch it so the watcher does not die and clean up.
            //Triggers the clean just in case files have been deleted or renamed etc
            gulp.start(["layouts-clean"]);
        });
});

//This checks which files need deleting based on what exists on the main directory
//Note: this function has a lot of exist checks in case multiple functions get fired at once so we don't duplicate or cause errors.
gulp.task('layouts-clean', function ()
{
    //Checks if the directory has been compiled and the original exists, otherwise there is no point trying to check for deletes etc.
    if (exists(originalDirectory) && exists(compiledDirectory))
    {
        //Gets all the folders in the directory
        var baseFolders = getFolders(originalDirectory);

        //Gets all the folders in the directory
        var compiledFolders = getFolders(compiledDirectory);

        //Deletes any folder structure that do not exist in the uncompiled versions
        var compiledFolderChecks = compiledFolders.map(function (folder) {
            //Checks if the folder does not exist within the uncompiled version, if so removes it as its obsolete
            if (!exists(path.join(originalDirectory, folder))) {
                del.sync(path.join(compiledDirectory, folder));
                del.sync(path.join(cacheBasePath, folderName, folder));//Cache list
            }
        });

        //Runs the cleaning process for the inner js and css
        CleanStructureMultiLayer(baseFolders, originalDirectory, compiledDirectory, path.join(cacheBasePath, folderName), "js");
        CleanStructureMultiLayer(baseFolders, originalDirectory, compiledDirectory, path.join(cacheBasePath, folderName), "css");

        //Checks if there are still any folders in the main directory now, if not then remove the parent directory as well
        var newFolders = getFolders(compiledDirectory);
        if (newFolders.length <= 0 && exists(compiledDirectory)) {
            del.sync(compiledDirectory);
            del.sync(path.join(cacheBasePath, folderName));//Cache list
        }
    }
    else if (exists(compiledDirectory))
    {
        //does not exist on the original but is still in the compiled so delete it
        del.sync(compiledDirectory);
        del.sync(path.join(cacheBasePath, folderName));//Cache list
    }
});

//Compiles all the personal plugin js and css in minified format split up into their corraspending plugin folders
gulp.task('layouts', function ()
{
    //Only run if theres something to compile
    if (exists(originalDirectory))
    {
        //Gets all the folders in the directory
        var baseFolders = getFolders(originalDirectory);

        //Checks if its a different build type to the previous build ran
        BuildTypeCheck("release", compiledDirectory, cacheBasePath, cacheBuildTypeName, folderName);

        //Conats and minifes the structures
        ConAndMinMultiLayer(baseFolders, originalDirectory, compiledDirectory, path.join(cacheBasePath, folderName), "js", false);
        ConAndMinMultiLayer(baseFolders, originalDirectory, compiledDirectory, path.join(cacheBasePath, folderName), "css", false);
    }
});

//Compiles all the personal plugin js and css in minified format split up into their corraspending plugin folders
gulp.task('debug-layouts', function () {
    //Only run if theres something to compile
    if (exists(originalDirectory))
    {
        //Gets all the folders in the directory
        var baseFolders = getFolders(originalDirectory);

        //Checks if its a different build type to the previous build ran
        BuildTypeCheck("debug", compiledDirectory, cacheBasePath, cacheBuildTypeName, folderName);

        //Conats and minifes the structures
        ConAndMinMultiLayer(baseFolders, originalDirectory, compiledDirectory, path.join(cacheBasePath, folderName), "js", true);
        ConAndMinMultiLayer(baseFolders, originalDirectory, compiledDirectory, path.join(cacheBasePath, folderName), "css", true);        
    }
});