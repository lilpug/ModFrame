//Gulp plugin extensions
var gulp = require('gulp');

//personal plugins
var env = require("./plugins/environment");

//Main task which runs both the main run method and clean methods
gulp.task("0-MF-run-and-clean", ["3-MF-clean-all", "1-MF-run"]);

//Main task which gets called to run all the minification functions *or only compiling if minification is turned off*
gulp.task('1-MF-run', function ()
{
    //Checks which version it should build based on the environment
    if (env.isDevelopment())
    {
        //Not minified
        gulp.start('MF-debug-build');
    }
    else
    {
        //Fully minified
        gulp.start('MF-release-build');
    }
});

//Main task which gets called to load the watchers for visual studio
gulp.task("2-MF-start-watchers", ["0-MF-run-and-clean", "MF-files-watch", "MF-globals-watch", "MF-layouts-watch", "MF-modules-watch", "MF-personal-plugins-watch"]);

//Main Task which gets called to clean all the files that have been removed or restructured
gulp.task("3-MF-clean-all", ["MF-files-clean", "MF-globals-clean", "MF-layouts-clean", "MF-modules-clean", "MF-personal-plugins-clean", "MF-external-plugins-sync"]);

//Main task which gets called to load fire of the file sync for visual studio
gulp.task("4-MF-files", ["MF-files", "MF-files-clean"]);

//Main task that builds the minifcation and compilation of all the different types
gulp.task("MF-release-build", ["MF-files", "MF-globals", "MF-layouts", "MF-modules", "MF-personal-plugins", "MF-external-plugins-sync"]);

//Main task that builds only the compilation of all the different types *no minification*
gulp.task("MF-debug-build", ["MF-files", "MF-debug-globals", "MF-debug-layouts", "MF-debug-modules", "MF-debug-personal-plugins", "MF-external-plugins-sync"]);