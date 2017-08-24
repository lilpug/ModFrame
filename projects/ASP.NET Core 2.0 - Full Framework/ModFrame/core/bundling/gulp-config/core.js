//Gulp plugin extensions
var gulp = require('gulp');

//personal plugins
var env = require("./plugins/enviroment");

//Main task which runs both the main run method and clean methods
gulp.task("0-run-and-clean", ["3-clean-all", "1-run"]);

//Main task which gets called to run all the minification functions *or only compiling if minification is turned off*
gulp.task('1-run', function ()
{
    //Checks which version it should build based on the enviroment
    if (env.isDevelopment())
    {
        //Not minified
        gulp.start('debug-build');
    }
    else
    {
        //Fully minified
        gulp.start('release-build');
    }
});

//Main task which gets called to load the watchers for visual studio
gulp.task("2-start-watchers", ["0-run-and-clean", "globals-watch", "layouts-watch", "modules-watch", "personal-plugins-watch", "packages-watch"]);

//Main Task which gets called to clean all the files that have been removed or restructured
gulp.task("3-clean-all", ["globals-clean", "layouts-clean", "modules-clean", "personal-plugins-clean", "external-plugins-sync"]);

//Main task which gets called to load fire of the package regeneration for visual studio
gulp.task("4-packages", ["packages"]);

//Main task that builds the minifcation and compilation of all the different types
gulp.task("release-build", ["packages", "globals", "layouts", "modules", "personal-plugins", "external-plugins-sync"]);

//Main task that builds only the compilation of all the different types *no minification*
gulp.task("debug-build", ["packages", "debug-globals", "debug-layouts", "debug-modules", "debug-personal-plugins", "external-plugins-sync"]);