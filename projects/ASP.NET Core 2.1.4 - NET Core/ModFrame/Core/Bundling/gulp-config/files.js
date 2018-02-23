//Gulp plugin extensions
var gulp = require('gulp');
var path = require("path");
var chokidar = require('chokidar');
var through = require('through2');
var pump = require('pump');
var del = require("del");
var dirSync = require('gulp-directory-sync');

//personal plugins
var Exists = require("./plugins/Exists");
var GetFolders = require("./plugins/GetFolders");
var GetFoldersAndFiles = require("./plugins/GetFoldersAndFiles");

//Stores the base destination location
var destination = path.join("wwwroot", "files");

gulp.task('MF-files-watch', function ()
{
    //Watches all the files folder changes throughout ModFrame
    chokidar.watch(["./modules/**/**/files/**", "./layouts/**/files/**", "./modframe/global/files/**"], { ignoreInitial: true, depth: 5 })
        .on('all', function (event)
        {
            //Runs the build task
            gulp.start(["MF-files"]);

            //Triggers the clean just in case files have been deleted or renamed etc
            gulp.start(["MF-files-clean"]);
        })        
        .on('error', function ()
        {
            //Note: it often breaks on windows when deleting a folder its watching on, so catch it so the watcher does not die and clean up.
            //Triggers the clean just in case files have been deleted or renamed etc
            gulp.start(["MF-files-clean"]);
        });
});

gulp.task('MF-files', function ()
{   
    //This section deals with adding/updating the files to the destination location
    pump([
        gulp.src(["./modules/**/**/files", "./layouts/**/files", "./modframe/global/files"]),
        through.obj(function (chunk, enc, cb)
        {
            //Stores the file path
            var filePath = chunk.path;

            //Stores the original length so we know if its changed with the replaces
            var length = filePath.length;

            //Runs this version first to replace the extra modframe\global if dealing with globals
            filePath = filePath.replace(path.resolve("./modframe"), "");

            //Others this version will kick in and replace the default baseline
            filePath = filePath.replace(path.resolve("./"), "");

            //Checks a replace has actually occured which verifies our destination output is now correct
            if (filePath.length != length)
            {
                //Stores the files and folders within that directory
                var items = [];
                if (Exists(chunk.path))
                {
                    items = GetFoldersAndFiles(chunk.path);
                }

                //Checks if the directory has atleast something before we sync its content to the destination location
                if (items.length > 0)
                {
                    //This syncs the source to the destionation
                    gulp.src('').pipe(dirSync(chunk.path, path.join(destination, filePath), { printSummary: false }));
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
    });
});

gulp.task('MF-files-clean', function ()
{
    //This section deals with processing the clean methods for the files at the destination location
    pump([
        gulp.src(["wwwroot/files/modules/**/**/files", "wwwroot/files/layouts/**/files", "wwwroot/files/global/files"]),
        through.obj(function (chunk, enc, cb) {
            //Stores the file path
            var filePath = chunk.path;

            //Stores the original length so we know if its changed with the replaces
            var length = filePath.length;

            //Runs this version first to replace the extra modframe\global if dealing with globals
            filePath = filePath.replace(path.resolve("./wwwroot/files/global"), "\\modframe\\global");

            //Otherwise this version will kick in and replace the default baseline
            filePath = filePath.replace(path.resolve("./wwwroot/files"), "");

            //Gets the root path so we can switch between the source and destionation for checks
            var root = path.resolve("./");

            //Stores the files and folders within the current files directory from the source
            var items = [];
            if (Exists(path.join(root, filePath)))
            {
                items = GetFoldersAndFiles(path.join(root, filePath));
            }

            if (
                //Checks if the length has changed so we know the replacement has been activated correctly
                length != filePath.length &&

                //Checks if the source files folder no longer exists for the destination version or has no content inside it
                (!Exists(path.join(root, filePath)) || items.length == 0)
            ) {
                //Removes the files parent folder as its source does not exist anymore or it is now empty
                del.sync(path.join(chunk.path, ".."));

                //Tells us if the current path we are dealing with is a global folder type
                if (filePath.indexOf("\\modframe\\global") == 0) {
                    //Global only has way layer so we do not need to do anything here
                }
                //Tells us if the current path we are dealing with is a modules folder type
                else if (filePath.indexOf("\\modules\\") == 0) {
                    if (Exists(path.join(chunk.path, "..", ".."))) {
                        //Gets the amount of folders in module groups destination since our deletion
                        var folders = GetFolders(path.join(chunk.path, "..", ".."));

                        //If its empty then we remove it
                        if (folders.length == 0) {
                            //Removes the empty files -> modules -> module group 
                            del.sync(path.join(chunk.path, "..", ".."));

                            //Gets the amount of folders from the modules destionation folder since our deletion
                            var baseFolders = GetFolders(path.join(chunk.path, "..", "..", ".."));

                            //If its empty then we remove it
                            if (baseFolders.length == 0) {
                                //Removes the empty files -> modules
                                del.sync(path.join(chunk.path, "..", "..", ".."));
                            }
                        }
                    }
                }
                //Tells us if the current path we are dealing with is a layouts folder type
                else if (filePath.indexOf("\\layouts") == 0) {
                    if (Exists(path.join(chunk.path, "..", ".."))) {
                        //Gets the amount of folders from the layouts destionation folder since our deletion
                        var folders = GetFolders(path.join(chunk.path, "..", ".."));

                        //If its empty then we remove it
                        if (folders.length == 0) {
                            //Removes the empty files -> layouts
                            del.sync(path.join(chunk.path, "..", ".."));
                        }
                    }
                }
            }

            //Returns the chunks
            cb(null, chunk)
        }),
    ],
        function (err) {
            //Only outputs the error if its not undefined *can happen when loading first time or after a main error as other processes follow*
            if (err != undefined && err != null) {
                console.log("Error: " + err);
            }
            else {
                //Since the clean up process has finished this checks to see if the base files folder should even be at the destionation now

                //Gets the real path to the files destination folder
                var baseFolder = path.resolve("./wwwroot/files");

                //Checks if it exists
                if (Exists(baseFolder)) {
                    //Stores the folders remaining inside the files destination folder
                    var folders = GetFolders(baseFolder);

                    //If its empty then we remove it
                    if (folders.length == 0) {
                        //Removes the empty files destination folder
                        del.sync(baseFolder);
                    }
                }
            }
        });
});