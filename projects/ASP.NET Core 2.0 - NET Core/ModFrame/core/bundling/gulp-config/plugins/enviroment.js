var fs = require('fs');

// Holds information about the hosting environment.
var environment = {
    // Gets the current hosting environment the application is running under. This comes from the environment variables.
    current: function ()
    {
        //Loads the config file
        var configFile = JSON.parse(fs.readFileSync(require.resolve('../../../../config/config.json'), 'utf8'));        

        //Gets the flag value for to tell us if we are in development or production
        return configFile.core.is_minified;
    },
    // Are we running under the development environment.
    isDevelopment: function () { return this.current() === false; },
    // Are we running under the production environment.
    isProduction: function () { return this.current() === true; }
};

// Exporting the plugins main function
module.exports = environment;