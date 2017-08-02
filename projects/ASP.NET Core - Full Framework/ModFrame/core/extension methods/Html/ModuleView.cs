using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;

/// <summary>
/// <see cref="IHtmlHelper"/> extension methods.
/// </summary>
public static partial class HtmlViewExtension
{   
    public static IHtmlContent ModuleView(this IHtmlHelper html, string moduleName, string viewRoute)
    {
        return html.Partial(string.Format("{0}{1}/views/{2}", ModFrame.moduleBase, moduleName, viewRoute));
    }    
}



