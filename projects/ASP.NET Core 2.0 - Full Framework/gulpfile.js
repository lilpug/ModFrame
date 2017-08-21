/// <binding AfterBuild='1-run' Clean='3-clean-all' ProjectOpened='2-start-watchers' />
"use strict";

var gulp = require("gulp");    
var requireDir = require("require-dir");    

//Includes the main gulp tasks for the framework
requireDir("./modframe/core/bundling/gulp-config");