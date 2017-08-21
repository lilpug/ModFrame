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
var ConAndMinSingleLayer = require("./plugins/cache/ConAndMinSingleLayer");
var CleanStructureSingleLayer = require("./plugins/cache/CleanStructureSingleLayer");

//The hosting file path
var hosting = "./wwwroot";

//Variables used for the directory paths etc
var compiledDirectory = path.join(hosting, 'components', 'globals');
var originalDirectory = './modframe/global';
var folderName = "global";
var cacheBasePath = "./modframe/core/bundling/gulp-config/cache-store";
var cacheBuildTypeName = "build-types";


//Sets up the watcher for file changes in the css and js files
gulp.task('globals-watch', function ()
{
    //Stores the directories to watch
    var watchJSPath = path.join(originalDirectory, 'js/**/*.js');
    var watchCSSPath = path.join(originalDirectory, 'css/**/*.css');

    chokidar.watch([watchJSPath, watchCSSPath], { ignoreInitial: true, depth: 5 })
        .on('all', function (event, path) {
            //Triggers the clean just in case files have been deleted or renamed etc
            gulp.start(["globals-clean"]);

            //Triggers the update method
            if (env.isDevelopment()) {
                gulp.start(['debug-globals']);
            }
            else {
                gulp.start(['globals']);
            }
        })
        .on('error', function () {
            //Note: it often breaks on windows when deleting a folder its watching on, so catch it so the watcher does not die and clean up.
            //Triggers the clean just in case files have been deleted or renamed etc
            gulp.start(["globals-clean"]);
        });
});

//This checks which files need deleting based on what exists on the main directory
//Note: this function has a lot of exist checks in case multiple functions get fired at once so we don't duplicate or cause errors.
gulp.task('globals-clean', function ()
{
    //Checks if the directory has been compiled and the original exists, otherwise there is no point trying to check for deletes etc.
    if (exists(originalDirectory) && exists(compiledDirectory))
    {       
        //Runs the cleaning process for the inner js and css
        CleanStructureSingleLayer(originalDirectory, compiledDirectory, path.join(cacheBasePath, folderName), "js");
        CleanStructureSingleLayer(originalDirectory, compiledDirectory, path.join(cacheBasePath, folderName), "css");

        //Checks if there are still any folders in the main directory now, if not then remove the parent directory as well
        var newFolders = getFolders(compiledDirectory);
        if (newFolders.length <= 0 && exists(compiledDirectory))
        {
            del.sync(compiledDirectory);
            del.sync(path.join(cacheBasePath, folderName));//Cache list            
        }
    }
    else if(exists(compiledDirectory))
    {
        //does not exist on the original but is still in the compiled so delete it
        del.sync(compiledDirectory);
        del.sync(path.join(cacheBasePath, folderName));//Cache list
    }
});

//Compiles all the personal plugin js and css in minified format split up into their corraspending plugin folders
gulp.task('globals', function ()
{
    //Only run if theres something to compile
    if (exists(originalDirectory))
    {
        //Checks if its a different build type to the previous build ran
        BuildTypeCheck("release", compiledDirectory, cacheBasePath, cacheBuildTypeName, folderName);

        //Conats and minifes the structures
        ConAndMinSingleLayer(originalDirectory, compiledDirectory, path.join(cacheBasePath, folderName), "js", false);
        ConAndMinSingleLayer(originalDirectory, compiledDirectory, path.join(cacheBasePath, folderName), "css", false);
    }
});

//Compiles all the personal plugin js and css in minified format split up into their corraspending plugin folders
gulp.task('debug-globals', function () {
    //Only run if theres something to compile
    if (exists(originalDirectory))
    {
        //Checks if its a different build type to the previous build ran
        BuildTypeCheck("debug", compiledDirectory, cacheBasePath, cacheBuildTypeName, folderName);

        //Conats and minifes the structures
        ConAndMinSingleLayer(originalDirectory, compiledDirectory, path.join(cacheBasePath, folderName), "js", true);
        ConAndMinSingleLayer(originalDirectory, compiledDirectory, path.join(cacheBasePath, folderName), "css", true);
    }
});