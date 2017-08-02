using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;

/// <summary>
/// <see cref="IHtmlHelper"/> extension methods.
/// </summary>
public static partial class HtmlViewExtension
{
    public static IHtmlContent LayoutView(this IHtmlHelper html, string layoutName, string viewRoute, object model = null)
    {
        return html.Partial(string.Format("{0}/{1}/views/{2}", ModFrame.layoutBase, layoutName, viewRoute), model);
    }    
}



