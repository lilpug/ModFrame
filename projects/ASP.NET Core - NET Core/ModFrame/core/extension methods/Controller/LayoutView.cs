using Microsoft.AspNetCore.Mvc;

/// <summary>
/// <see cref="Controller"/> extension methods.
/// </summary>
public static partial class ControllerViewExtension
{
    public static ViewResult LayoutView(this Controller controller, string viewRoute)
    {
        return controller.View(string.Format("{0}{1}", ModFrame.layoutBase, viewRoute));
    }
}



