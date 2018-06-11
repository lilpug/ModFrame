//Gulp plugin extensions
var gulp = require('gulp');
var concat = require("gulp-concat");
var cssmin = require("gulp-cssmin");
var uglify = require("gulp-uglify");
var del = require("del");
var path = require("path");
var gulpif = require('gulp-if');

//personal plugins
var Exists = require("./Exists");
var GetFolders = require("./GetFolders");
var CoreConAndMin = require("./CoreConAndMin");

//This function deals with processing the minification and concatination of the js and css structures
function ConAndMinMultiLayer(baseFolders, originalDirectory, compiledDirectory, extensionType, isDebug)
{
    //Loops over the base folders i.e. modules or layouts etc
    var tasks = baseFolders.map(function (baseFolder)
    {
        //Checks if the sub folder exists, if so goes into it
        if (Exists(path.join(originalDirectory, baseFolder, extensionType)))
        {
            //Loops over folders within the sub folder
            var secondFolders = GetFolders(path.join(originalDirectory, baseFolder, extensionType));
            var t2 = secondFolders.map(function (secondFolder)
            {   
                //Processes the core creation                
                CoreConAndMin(isDebug, path.join(originalDirectory, baseFolder, extensionType, secondFolder, '*.' + extensionType), path.join(compiledDirectory, baseFolder), extensionType, secondFolder);   

                var thirdFolders = GetFolders(path.join(originalDirectory, baseFolder, extensionType, secondFolder));
                var t3 = thirdFolders.map(function (thirdFolder)
                {
                    //Processes the core creation                    
                    CoreConAndMin(isDebug, path.join(originalDirectory, baseFolder, extensionType, secondFolder, thirdFolder, '**/*.' + extensionType), path.join(compiledDirectory, baseFolder), extensionType, path.join(secondFolder, thirdFolder));                    
                });
            });

            //Compiles the base level        
            //Processes the core creation            
            CoreConAndMin(isDebug, path.join(originalDirectory, baseFolder, extensionType + '/*.' + extensionType), path.join(compiledDirectory, baseFolder), extensionType);
        }
    });
}

// Exporting the plugins main function
module.exports = ConAndMinMultiLayer;