//Gulp plugin extensions
var gulp = require('gulp');
var path = require("path");
var chokidar = require('chokidar');
var through = require('through2');
var fs = require('fs');

//This gets all the plugins.json files from the modules, layouts and global folder and merges them into the main bower and npm files
var bowerFile = "bower.json";
var npmFile = "package.json";
var pluginFile = "plugins.json";

gulp.task('packages-watch', function ()
{
    //Stores the directories to watch
    var watchModulePath = path.join("./modules/**/**", pluginFile);
    var watchLayoutPath = path.join("./layouts/**", pluginFile);
    var watchGlobalPath = path.join("./modframe/global", pluginFile);
    var watchCorePath = path.join("./modframe/core/bundling", pluginFile);

    //Watches all the bower plugins.json changes
    chokidar.watch([watchModulePath, watchLayoutPath, watchGlobalPath, watchCorePath], { ignoreInitial: true, depth: 5 })
        .on('all', function ()
        {
            //Runs the build task
            gulp.start(["packages"]);
        })
        .on('error', function () {
            //Note: it often breaks on windows when deleting a folder its watching on, so catch it so the watcher does not die and clean up.
            gulp.start(["packages"]);
        });
});

gulp.task('packages', function ()
{
    //Stores the temp processed bower and npm packages
    var bowerStorage = new Object();
    var npmStorage = new Object();

    return gulp.src([path.join("modules/**/**", pluginFile), path.join("./layouts/**", pluginFile), path.join("./modframe/global", pluginFile), path.join("./modframe/core/bundling", pluginFile)])
            .pipe(through.obj(function (chunk, enc, cb)
            {
                //Loads the file as an object
                var file = require(chunk.path);

                if (file.bower != null && file.bower.dependencies != null) {
                    //Merges the current bower storage object with the bower dependencies
                    Object.assign(bowerStorage, file.bower.dependencies);
                }

                if (file.npm != null && file.npm.dependencies != null) {
                    //Merges the current bower storage object with the bower dependencies
                    Object.assign(npmStorage, file.npm.dependencies);
                }

                //Returns the chunks
                cb(null, chunk)
            }))
            .on('end', function (e)
            {
                //Bower section

                //Loads the original file
                var bowerConfig = require(path.join("../../../..", bowerFile));

                //Writes the new processed dependencies
                bowerConfig.dependencies = bowerStorage;

                //Writes the clear back to the original file            
                fs.writeFileSync(bowerFile, JSON.stringify(bowerConfig, null, 2));

                //NPM section

                //Loads the original file
                var npmConfig = require(path.join("../../../..", npmFile));

                //Writes the new processed dependencies
                npmConfig.dependencies = npmStorage;

                //Writes the clear back to the original file            
                fs.writeFileSync(npmFile, JSON.stringify(npmConfig, null, 2));
            });
});