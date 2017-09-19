//Gulp plugin extensions
var gulp = require('gulp');
var path = require("path");
var chokidar = require('chokidar');
var through = require('through2');
var fs = require('fs');
var pump = require('pump');
var cmd = require('node-cmd');

//This gets all the plugins.json files from the modules, layouts and global folder and merges them into the main bower and npm files
var bowerFile = "bower.json";
var npmFile = "package.json";
var pluginFile = "plugins.json";

//This is required to stop the chokidar watcher unlinking single specific files being watched when an editor is saving the file
//https://github.com/paulmillr/chokidar/issues/237
var chokidarWatchFix = '[p]lugins.json';

gulp.task('packages-watch', function ()
{
    //Stores the directories to watch
    var watchModulePath = path.join("./modules/**/**", chokidarWatchFix);
    var watchLayoutPath = path.join("./layouts/**", chokidarWatchFix);
    var watchGlobalPath = path.join("./modframe/global", chokidarWatchFix);
    var watchCorePath = path.join("./modframe/core/bundling", chokidarWatchFix);

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
    
    var fileLocations = [path.join("modules/**/**", pluginFile), path.join("./layouts/**", pluginFile), path.join("./modframe/global", pluginFile), path.join("./modframe/core/bundling", pluginFile)];

    pump([
        gulp.src(fileLocations),
        through.obj(function (chunk, enc, cb)
        {
            //Used to determine if everything went ok
            var failFlag = false;

            //Stores the file data and json parsed data
            var fileData = null;
            var file = null;


            //Checks the file data could be loaded
            try {
                fileData = fs.readFileSync(chunk.path, 'utf8');
            } catch (e) {
                failFlag = true;
                console.log("Error: Could not read file '" + chunk.path + "'");
            }

            //If the loading did not fail continue
            if (!failFlag) {
                //Checks its in valid json format
                try {
                    file = JSON.parse(fileData);
                } catch (e) {
                    failFlag = true;
                    console.log("Error: invalid JSON in the file '" + chunk.path + "'");
                }
            }

            //Checks the data could be loaded and the parser function went ok before continuing
            if (!failFlag) {
                if (file.bower != null && file.bower.dependencies != null) {
                    //Merges the current bower storage object with the bower dependencies
                    Object.assign(bowerStorage, file.bower.dependencies);
                }

                if (file.npm != null && file.npm.dependencies != null) {
                    //Merges the current bower storage object with the bower dependencies
                    Object.assign(npmStorage, file.npm.dependencies);
                }
            }

            //Returns the chunks
            cb(null, chunk)
        })
    ],
    function (err)
    {
        //Only outputs the error if its not undefined *can happen when loading first time or after a main error as other processes follow*
        if (err != undefined && err != null) {
            console.log("Error: " + err);
        }
        else
        {
            //Bower section

            //Loads the original file                         
            var bowerConfig = JSON.parse(fs.readFileSync(require.resolve(path.join("../../../..", bowerFile)), 'utf8'));

            //Checks if the bower package file has changed on its dependencies
            if (JSON.stringify(bowerConfig.dependencies) != JSON.stringify(bowerStorage))
            {
                //Writes the new processed dependencies
                bowerConfig.dependencies = bowerStorage;

                //Writes the clear back to the original file            
                fs.writeFileSync(bowerFile, JSON.stringify(bowerConfig, null, 2));

                //Runs the bower install, update and uninstall methods for any new packages and removal of any packages
                cmd.run('bower install');
                cmd.run('bower prune');
            }

            //NPM section

            //Loads the original file                
            var npmConfig = JSON.parse(fs.readFileSync(require.resolve(path.join("../../../..", npmFile)), 'utf8'));

            //Checks if the npm package file has changed on its dependencies
            if (JSON.stringify(npmConfig.dependencies) != JSON.stringify(npmStorage))
            {
                //Writes the new processed dependencies
                npmConfig.dependencies = npmStorage;

                //Writes the clear back to the original file            
                fs.writeFileSync(npmFile, JSON.stringify(npmConfig, null, 2));

                //Runs the npm install, update and uninstall methods for any new packages and removal of any packages
                cmd.run('npm install');
                cmd.run('npm prune');
            }
        }
    });
});