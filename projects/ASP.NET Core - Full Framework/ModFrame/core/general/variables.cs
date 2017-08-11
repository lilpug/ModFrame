public static partial class ModFrame
{
    /// <summary>
    /// Stores the module folders base path
    /// </summary>
    public const string moduleBase = "~/modules/";

    /// <summary>
    /// Stores the layout folders base path
    /// </summary>
    public const string layoutBase = "~/layouts/";

    /// <summary>
    /// Stores the plugin folders base path
    /// </summary>
    public const string pluginBase = "~/plugins/";

    /// <summary>
    /// Stores the global folders base path
    /// </summary>
    public const string globalBase = "~/modframe/global/";

    /// <summary>
    /// Stores ModFrames core base path
    /// </summary>
	public const string coreBase = "~/modframe/Core/";

    /// <summary>
    /// Stores the path to the master header include file
    /// </summary>
    public const string headerInclude = "~/modframe/core/master includes/header.cshtml";

    /// <summary>
    /// Stores the path to the master footer include file
    /// </summary>
    public const string footerInclude = "~/modframe/core/master includes/footer.cshtml";
    
    /// <summary>
    /// Returns the full folder path to the application
    /// </summary>
    public static string theApplicationPath;
}
