﻿//Gulp plugin extensions
var gulp = require('gulp');
var path = require("path");
var dirSync = require('gulp-directory-sync');

//personal plugins
var Exists = require("./plugins/Exists");

//The hosting file paths
var hosting = "wwwroot";//Gets the hosting information on paths
var paths = {
    webroot: path.join("./", hosting + "/")
};

//Generic variables for this plugin
var compiledDirectory = path.join(paths.webroot, 'components', 'extra-plugins', 'n');
var originalDirectory = path.join("./", 'plugins/external');

//Syncs all the new files into the compiled directory
gulp.task('MF-external-plugins-sync', function ()
{
    //Only run if theres something to compile
    if (Exists(originalDirectory))
    {
        return gulp.src('')
        .pipe(dirSync(originalDirectory, compiledDirectory, { printSummary: true }));
    }
});