﻿var fs = require('fs');

//Function to determine if a file or directory exists
function Exists(dir) {
    try {
        var stat = fs.statSync(dir);
        if (stat) {
            return true;
        }
    }
    catch (e) {
        return false;
    }
}

// Exporting the plugins main function
module.exports = Exists;