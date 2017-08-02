using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;

/// <summary>
/// <see cref="IHtmlHelper"/> extension methods.
/// </summary>
public static partial class HtmlViewExtension
{
    public static IHtmlContent GlobalView(this IHtmlHelper html, string viewRoute)
    {
        return html.Partial(string.Format("{0}views/{1}", ModFrame.globalBase, viewRoute));
    }    
}



