using Microsoft.AspNetCore.Mvc;

/// <summary>
/// <see cref="Controller"/> extension methods.
/// </summary>
public static partial class ControllerViewExtension
{
    public static ViewResult ModuleView(this Controller controller, string groupName, string moduleName, string viewRoute, object model = null)
    {
        return controller.View(string.Format("{0}{1}/{2}/views/{3}", ModFrame.moduleBase, groupName, moduleName, viewRoute), model);
    }
}



