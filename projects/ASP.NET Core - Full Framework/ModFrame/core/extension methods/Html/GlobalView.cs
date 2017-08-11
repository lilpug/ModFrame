using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;

/// <summary>
/// <see cref="IHtmlHelper"/> extension methods.
/// </summary>
public static partial class HtmlViewExtension
{
    /// <summary>
    /// This function returns a IHtmlContent from a specified global view
    /// </summary>
    /// <param name="html"></param>
    /// <param name="viewRoute"></param>
    /// <returns></returns>
    public static IHtmlContent GlobalView(this IHtmlHelper html, string viewRoute)
    {
        return html.Partial($"{ModFrame.globalBase}views/{viewRoute}");
    }    
}



