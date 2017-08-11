using Microsoft.Extensions.Configuration;

public static partial class ModFrame
{   
    /// <summary>
    /// This stores the original configuration setup from the aspnet core startup
    /// Note: this enables us to dynamically access the config.json without spinning new objects up all the time
    /// </summary>
    private static IConfigurationRoot _ConfigReader;
    
    /// <summary>
    /// This returns the config.json configuration reader that was create at the start of the application
    /// </summary>
    public static IConfigurationRoot ConfigReader
    {
        get
        {
            try
            {
                /*
                  This allows us to return the _ConfigReader but also ensures it reloads any configuration changes which have occured.
                  Note: The additional processing for this is 0.1 - 2 miliseconds which is why its been put in.
                  Extra: The reloadOnChange option relies on dependancy injection for configuration variables which seems a bit limited. 
                */
                _ConfigReader.Reload();
                return _ConfigReader;
            }
            catch
            {
                return null;
            }
        }
        set
        {
            _ConfigReader = value;
        }
    }
}
