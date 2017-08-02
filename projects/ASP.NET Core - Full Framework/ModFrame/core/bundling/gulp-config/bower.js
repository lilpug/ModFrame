//Gulp plugin extensions
var gulp = require('gulp');
var extend = require('gulp-extend');
var path = require("path");
var chokidar = require('chokidar');

//This gets all the plugins.json files from the modules and layouts and merges them into the main bower file
//Note: this ensures all js and css packages required for the project are installed in the lib.
var bowerFile = "bower.json";
var bowerExtensionsName = "plugins.json";

gulp.task('bower-packages-watch', function ()
{
    //Stores the directories to watch
    var watchModulePath = path.join("./modules/**/**", bowerExtensionsName);
    var watchLayoutPath = path.join("./layouts/**", bowerExtensionsName);
    var watchGlobalPath = path.join("./modframe/global/**", bowerExtensionsName);

    //Watches all the bower plugins.json changes
    chokidar.watch([watchModulePath, watchLayoutPath, watchGlobalPath], { ignoreInitial: true, depth: 5 })
        .on('all', function ()
        {
            //Runs the build task
            gulp.start(["bower-packages"]);
        })
        .on('error', function () {
            //Note: it often breaks on windows when deleting a folder its watching on, so catch it so the watcher does not die and clean up.
            gulp.start(["bower-packages"]);
        });
});

gulp.task('bower-packages', function () {
    //Loads the original file
    var config = require("../../../../bower.json");

    //Clears the dependencies
    config.dependencies = null;
    
    //Writes the clear back to the original file
    var fs = require('fs');
    fs.writeFileSync(bowerFile, JSON.stringify(config));

    //Pulls all the bower configs and merges it into the empty attribute dependencies as we just cleared it
    //Note: the clearing is done so if any plugins are removed from plugins files we don't retain them still in the original so we need to clear it!
    return gulp.src([bowerFile, "modules/**/**/" + bowerExtensionsName, "layouts/**/" + bowerExtensionsName, "modframe/global/" + bowerExtensionsName])
    .pipe(extend(bowerFile))
    .pipe(gulp.dest("./"));
});