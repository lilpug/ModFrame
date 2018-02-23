//Gulp plugin extensions
var gulp = require('gulp');
var concat = require("gulp-concat");
var cssmin = require("gulp-cssmin");
var uglify = require("gulp-uglify");
var less = require('gulp-less');
var sass = require('gulp-sass');

var path = require("path");
var newer = require("gulp-newer");
var gulpif = require('gulp-if');
var filter = require('gulp-filter');
var pump = require('pump');
var babel = require('gulp-babel');

//Processes the concatenation and minification of JS or CSS deppending on which is supplied 
function CoreConAndMin(isDebug, fileLocations, compiledBaseLocation, extensionType, extraCompiled)
{   
    //Checks if the fileLocations is looking for css files
    if (fileLocations.indexOf(".css") >= -1)
    {
        //Adds the extra support for less and sass files if its css concatenation and minification
        fileLocations = [fileLocations, fileLocations.replace(".css", ".less"), fileLocations.replace(".css", ".scss")];
    }

    //Creates filters to allow us to work specifically only with less and scss files if its in the css processing
    var sassFilter = filter('**/*.scss', { restore: true });
    var lessFilter = filter('**/*.less', { restore: true });
    
    //Checks if the field has been supplied if not makes it an empty string
    if (extraCompiled == undefined)
    {
        extraCompiled = "";
    }
    
    pump([
        gulp.src(fileLocations),

        //If the cached file list is not different then check if anything has changed in the files before pushing them through
        newer(path.join(compiledBaseLocation, extraCompiled, extensionType, 'min.' + extensionType)),

        //Processes the sass section if any sass files
        sassFilter,
        sass(),
        sassFilter.restore,

        //Processes the less section if any less files
        lessFilter,
        less(),
        lessFilter.restore,
        
        //Checks if its js and runs the normal js through a babel check to compile any ES code into normal js
        gulpif((extensionType == "js"), babel({ "presets": ["@babel/preset-env"]})),
        
        //Checks if its js and uglifys it if so
        gulpif((isDebug == false && extensionType == "js"), uglify()),

        //Checks if its css and minifys it if so
        gulpif((isDebug == false && extensionType == "css"), cssmin()),

        //Adds the files all together
        //Note: this is after uglify as if any errors occur we can then show which file it was rather than the min.js
        concat('min.' + extensionType),

        //Outputs it to the destination
        gulp.dest(path.join(compiledBaseLocation, extensionType, extraCompiled))
    ],
    function (err)
    {
        //Only outputs the error if its not undefined *can happen when loading first time or after a main error as other processes follow*
        if (err != undefined && err != null)
        {
            console.log("Error: " + err);
        }
    });
}

// Exporting the plugins main function
module.exports = CoreConAndMin;