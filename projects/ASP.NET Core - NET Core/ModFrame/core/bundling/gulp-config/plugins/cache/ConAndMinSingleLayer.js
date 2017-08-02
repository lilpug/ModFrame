//Gulp plugin extensions
var gulp = require('gulp');
var concat = require("gulp-concat");
var cssmin = require("gulp-cssmin");
var uglify = require("gulp-uglify");
var del = require("del");
var path = require("path");
var newer = require("gulp-newer");
var gulpif = require('gulp-if');

//personal plugins
var fileChecker = require("./fileChecker");
var exists = require("../exists");
var getFolders = require("../getFolders");

//This function deals with processing the minification and concatination of the js and css structures
function ConAndMinSingleLayer(originalDirectory, compiledDirectory, cacheDirectory, extensionType, isDebug) {
    //Checks the sub folder exists
    if (exists(path.join(originalDirectory, extensionType))) {
        //Loops over folders in the sub folder
        var secondFolders = getFolders(path.join(originalDirectory, extensionType));
        var t2 = secondFolders.map(function (secondFolder) {

            //Checks if any files have been added or deleted
            if (!fileChecker(path.join(originalDirectory, extensionType, secondFolder), "." + extensionType, false, path.join(cacheDirectory, extensionType), "base-" + secondFolder)) {
                gulp.src(path.join(originalDirectory, extensionType, secondFolder, '*.' + extensionType))
                    .pipe(concat('min.' + extensionType))
                    .pipe(gulpif((isDebug == false && extensionType == "js"), uglify()))
                    .pipe(gulpif((isDebug == false && extensionType == "css"), cssmin()))
                    .pipe(gulp.dest(path.join(compiledDirectory, extensionType, secondFolder)));
            }
            else {
                gulp.src(path.join(originalDirectory, extensionType, secondFolder, '*.' + extensionType))
                    //Checks if any of the files in that folder are newer than the compiled version
                    .pipe(newer(path.join(compiledDirectory, extensionType, secondFolder, 'min.' + extensionType)))
                    .pipe(concat('min.' + extensionType))
                    .pipe(gulpif((isDebug == false && extensionType == "js"), uglify()))
                    .pipe(gulpif((isDebug == false && extensionType == "css"), cssmin()))
                    .pipe(gulp.dest(path.join(compiledDirectory, extensionType, secondFolder)));
            }

            var thirdFolders = getFolders(path.join(originalDirectory, extensionType, secondFolder));
            var t3 = thirdFolders.map(function (thirdFolder) {
                //Checks if any files have been added or deleted
                if (!fileChecker(path.join(originalDirectory, extensionType, secondFolder, thirdFolder), "." + extensionType, true, path.join(cacheDirectory, extensionType), "base-" + secondFolder + "-" + thirdFolder)) {
                    gulp.src(path.join(originalDirectory, extensionType, secondFolder, thirdFolder, '**/*.' + extensionType))
                        .pipe(concat('min.' + extensionType))
                        .pipe(gulpif((isDebug == false && extensionType == "js"), uglify()))
                        .pipe(gulpif((isDebug == false && extensionType == "css"), cssmin()))
                        .pipe(gulp.dest(path.join(compiledDirectory, extensionType, secondFolder, thirdFolder)));
                }
                else {
                    gulp.src(path.join(originalDirectory, extensionType, secondFolder, thirdFolder, '**/*.' + extensionType))
                        //Checks if any of the files in that folder are newer than the compiled version
                        .pipe(newer(path.join(compiledDirectory, extensionType, secondFolder, thirdFolder, 'min.' + extensionType)))
                        .pipe(concat('min.' + extensionType))
                        .pipe(gulpif((isDebug == false && extensionType == "js"), uglify()))
                        .pipe(gulpif((isDebug == false && extensionType == "css"), cssmin()))
                        .pipe(gulp.dest(path.join(compiledDirectory, extensionType, secondFolder, thirdFolder)));
                }
            });
        });

        //Compiles the base level

        //Checks if any files have been added or deleted
        if (!fileChecker(path.join(originalDirectory, extensionType), "." + extensionType, false, path.join(cacheDirectory, extensionType), "base")) {
            gulp.src(path.join(originalDirectory, extensionType + '/*.' + extensionType))
                .pipe(concat('min.' + extensionType))
                .pipe(gulpif((isDebug == false && extensionType == "js"), uglify()))
                .pipe(gulpif((isDebug == false && extensionType == "css"), cssmin()))
                .pipe(gulp.dest(path.join(compiledDirectory, extensionType)));
        }
        else {
            gulp.src(path.join(originalDirectory, extensionType + '/*.' + extensionType))
                //Checks if any of the files in that folder are newer than the compiled version
                .pipe(newer(path.join(compiledDirectory, extensionType, 'min.' + extensionType)))
                .pipe(concat('min.' + extensionType))
                .pipe(gulpif((isDebug == false && extensionType == "js"), uglify()))
                .pipe(gulpif((isDebug == false && extensionType == "css"), cssmin()))
                .pipe(gulp.dest(path.join(compiledDirectory, extensionType)));
        }
    }
}

// Exporting the plugins main function
module.exports = ConAndMinSingleLayer;