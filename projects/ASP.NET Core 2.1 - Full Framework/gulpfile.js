/// <binding AfterBuild='1-MF-run' Clean='3-MF-clean-all' ProjectOpened='2-MF-start-watchers' />
"use strict";

var gulp = require("gulp");    
var requireDir = require("require-dir");    

//Includes the main gulp tasks for the framework
requireDir("./modframe/core/bundling/gulp-config");