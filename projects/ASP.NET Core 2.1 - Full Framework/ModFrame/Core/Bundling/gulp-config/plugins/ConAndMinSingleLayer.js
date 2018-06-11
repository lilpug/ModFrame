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
function ConAndMinSingleLayer(originalDirectory, compiledDirectory, extensionType, isDebug)
{    
    //Checks if the folder exists, if so goes into it
    if (Exists(path.join(originalDirectory, extensionType)))
    {
        //Loops over folders within the sub folder
        var baseFolders = GetFolders(path.join(originalDirectory, extensionType));
        var t1 = baseFolders.map(function (baseFolder)
        {   
            //Processes the core creation                
            coreConAndMin(isDebug, path.join(originalDirectory, extensionType, baseFolder, '*.' + extensionType), compiledDirectory, extensionType, baseFolder);   

            var secondFolders = GetFolders(path.join(originalDirectory, extensionType, baseFolder));
            var t2 = secondFolders.map(function (secondFolder)
            {
                //Processes the core creation                    
                CoreConAndMin(isDebug, path.join(originalDirectory, extensionType, baseFolder, secondFolder, '**/*.' + extensionType), compiledDirectory, extensionType, path.join(baseFolder, secondFolder));                    
            });
        });

        //Compiles the base level        
        //Processes the core creation            
        CoreConAndMin(isDebug, path.join(originalDirectory, extensionType + '/*.' + extensionType), compiledDirectory, extensionType);
    }    
}

// Exporting the plugins main function
module.exports = ConAndMinSingleLayer;