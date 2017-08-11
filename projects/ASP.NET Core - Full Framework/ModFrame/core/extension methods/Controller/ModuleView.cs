using Microsoft.AspNetCore.Mvc;

/// <summary>
/// <see cref="Controller"/> extension methods.
/// </summary>
public static partial class ControllerViewExtension
{
    /// <summary>
    /// This function returns a module ViewResult from the supplied path information
    /// </summary>
    /// <param name="controller"></param>
    /// <param name="groupName"></param>
    /// <param name="moduleName"></param>
    /// <param name="viewRoute"></param>
    /// <param name="model">optional</param>
    /// <returns></returns>
    public static ViewResult ModuleView(this Controller controller, string groupName, string moduleName, string viewRoute, object model = null)
    {
        return controller.View($"{ModFrame.moduleBase}{groupName}/{moduleName}/views/{viewRoute}", model);
    }
}



