using Microsoft.AspNetCore.Mvc;

/// <summary>
/// <see cref="Controller"/> extension methods.
/// </summary>
public static partial class ControllerViewExtension
{
    /// <summary>
    /// This function returns a layout ViewResult from the supplied path information
    /// </summary>
    /// <param name="controller"></param>
    /// <param name="viewRoute"></param>
    /// <returns></returns>
    public static ViewResult LayoutView(this Controller controller, string viewRoute)
    {
        return controller.View($"{ModFrame.layoutBase}{viewRoute}");
    }
}



