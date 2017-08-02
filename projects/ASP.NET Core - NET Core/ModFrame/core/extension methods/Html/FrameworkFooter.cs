using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;

/// <summary>
/// <see cref="IHtmlHelper"/> extension methods.
/// </summary>
public static partial class HtmlViewExtension
{  
    public static IHtmlContent ModFrameFooter(this IHtmlHelper html)
    {
        return html.Partial(ModFrame.footerInclude);
    }    
}



