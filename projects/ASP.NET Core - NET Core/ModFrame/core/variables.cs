using Microsoft.Extensions.Configuration;

public static partial class ModFrame
{
    //Stores all the paths for the split modular mvc approach
    public const string moduleBase = "~/modules/";
    public const string layoutBase = "~/layouts/";
    public const string pluginBase = "~/plugins/";
    public const string globalBase = "~/modframe/global/";
	public const string coreBase = "~/modframe/Core/";
    public const string headerInclude = "~/modframe/core/master includes/header.cshtml";
    public const string footerInclude = "~/modframe/core/master includes/footer.cshtml";
    
    //Stores the full folder path to the application
    public static string theApplicationPath;       

    //Stores the configuration setup from the aspnet core startup
    //Note: this enables us to dynamically access the config.json without spinning new objects up all the time
    private static IConfigurationRoot _ConfigReader;

    //This allows us to return the ConfigReader above but also ensures it reloads any configuration changes which have occured.
    //Note: The additional processing for this is 0.1 - 2 miliseconds which is why its been put in.
    //Extra: The reloadOnChange option relies on dependancy injection for configuration variables which seems a bit limited.
    public static IConfigurationRoot ConfigReader
    {
        get
        {
            try
            {
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
