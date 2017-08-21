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
function ConAndMinMultiLayer(baseFolders, originalDirectory, compiledDirectory, cacheDirectory, extensionType, isDebug)
{
    //Loops over the base folders i.e. modules or layouts etc
    var tasks = baseFolders.map(function (baseFolder)
    {
        //Checks if the sub folder exists, if so goes into it
        if (exists(path.join(originalDirectory, baseFolder, extensionType))) {
            //Loops over folders within the sub folder
            var secondFolders = getFolders(path.join(originalDirectory, baseFolder, extensionType));
            var t2 = secondFolders.map(function (secondFolder) {

                //Checks if any files have been added or deleted
                if (!fileChecker(path.join(originalDirectory, baseFolder, extensionType, secondFolder), "." + extensionType, false, path.join(cacheDirectory, baseFolder, extensionType), "base-" + secondFolder)) {
                    gulp.src(path.join(originalDirectory, baseFolder, extensionType, secondFolder, '*.' + extensionType))
                      .pipe(concat('min.' + extensionType))
                      .pipe(gulpif((isDebug == false && extensionType == "js"), uglify()))
                      .pipe(gulpif((isDebug == false && extensionType == "css"), cssmin()))
                      .pipe(gulp.dest(path.join(compiledDirectory, baseFolder, extensionType, secondFolder)));
                }
                else {
                    gulp.src(path.join(originalDirectory, baseFolder, extensionType, secondFolder, '*.' + extensionType))
                       //Checks if any of the files in that folder are newer than the compiled version
                      .pipe(newer(path.join(compiledDirectory, baseFolder, extensionType, secondFolder, 'min.' + extensionType)))
                      .pipe(concat('min.' + extensionType))
                      .pipe(gulpif((isDebug == false && extensionType == "js"), uglify()))
                      .pipe(gulpif((isDebug == false && extensionType == "css"), cssmin()))
                      .pipe(gulp.dest(path.join(compiledDirectory, baseFolder, extensionType, secondFolder)));
                }

                var thirdFolders = getFolders(path.join(originalDirectory, baseFolder, extensionType, secondFolder));
                var t3 = thirdFolders.map(function (thirdFolder) {
                    //Checks if any files have been added or deleted
                    if (!fileChecker(path.join(originalDirectory, baseFolder, extensionType, secondFolder, thirdFolder), "." + extensionType, true, path.join(cacheDirectory, baseFolder, extensionType), "base-" + secondFolder + "-" + thirdFolder)) {
                        gulp.src(path.join(originalDirectory, baseFolder, extensionType, secondFolder, thirdFolder, '**/*.' + extensionType))
                          .pipe(concat('min.' + extensionType))
                          .pipe(gulpif((isDebug == false && extensionType == "js"), uglify()))
                          .pipe(gulpif((isDebug == false && extensionType == "css"), cssmin()))
                          .pipe(gulp.dest(path.join(compiledDirectory, baseFolder, extensionType, secondFolder, thirdFolder)));
                    }
                    else {
                        gulp.src(path.join(originalDirectory, baseFolder, extensionType, secondFolder, thirdFolder, '**/*.' + extensionType))
                           //Checks if any of the files in that folder are newer than the compiled version
                          .pipe(newer(path.join(compiledDirectory, baseFolder, extensionType, secondFolder, thirdFolder, 'min.' + extensionType)))
                          .pipe(concat('min.' + extensionType))
                          .pipe(gulpif((isDebug == false && extensionType == "js"), uglify()))
                          .pipe(gulpif((isDebug == false && extensionType == "css"), cssmin()))
                          .pipe(gulp.dest(path.join(compiledDirectory, baseFolder, extensionType, secondFolder, thirdFolder)));
                    }
                });
            });

            //Compiles the base level

            //Checks if any files have been added or deleted
            if (!fileChecker(path.join(originalDirectory, baseFolder, extensionType), "." + extensionType, false, path.join(cacheDirectory, baseFolder, extensionType), "base")) {
                gulp.src(path.join(originalDirectory, baseFolder, extensionType + '/*.' + extensionType))
                  .pipe(concat('min.' + extensionType))
                  .pipe(gulpif((isDebug == false && extensionType == "js"), uglify()))
                  .pipe(gulpif((isDebug == false && extensionType == "css"), cssmin()))
                  .pipe(gulp.dest(path.join(compiledDirectory, baseFolder, extensionType)));
            }
            else {
                gulp.src(path.join(originalDirectory, baseFolder, extensionType + '/*.' + extensionType))
                   //Checks if any of the files in that folder are newer than the compiled version
                  .pipe(newer(path.join(compiledDirectory, baseFolder, extensionType, 'min.' + extensionType)))
                  .pipe(concat('min.' + extensionType))
                  .pipe(gulpif((isDebug == false && extensionType == "js"), uglify()))
                  .pipe(gulpif((isDebug == false && extensionType == "css"), cssmin()))
                  .pipe(gulp.dest(path.join(compiledDirectory, baseFolder, extensionType)));
            }
        }
    });
}

// Exporting the plugins main function
module.exports = ConAndMinMultiLayer;