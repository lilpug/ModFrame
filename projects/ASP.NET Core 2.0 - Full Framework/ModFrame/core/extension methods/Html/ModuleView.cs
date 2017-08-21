using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;

/// <summary>
/// <see cref="IHtmlHelper"/> extension methods.
/// </summary>
public static partial class HtmlViewExtension
{
    /// <summary>
    /// This function returns a IHtmlContent from a specified module view
    /// </summary>
    /// <param name="html"></param>
    /// <param name="moduleName"></param>
    /// <param name="viewRoute"></param>
    /// <returns></returns>
    public static IHtmlContent ModuleView(this IHtmlHelper html, string moduleName, string viewRoute)
    {
        return html.Partial($"{ModFrame.moduleBase}{moduleName}/views/{viewRoute}");
    }    
}



