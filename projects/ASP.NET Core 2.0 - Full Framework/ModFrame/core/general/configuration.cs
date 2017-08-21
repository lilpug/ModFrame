using Microsoft.Extensions.Configuration;

public static partial class ModFrame
{   
    /// <summary>
    /// This returns the config.json configuration reader that was create at the start of the application
    /// </summary>
    public static IConfiguration ConfigReader { get; set; }
}
