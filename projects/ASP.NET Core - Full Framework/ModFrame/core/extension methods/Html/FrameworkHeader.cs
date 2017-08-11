using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;

/// <summary>
/// <see cref="IHtmlHelper"/> extension methods.
/// </summary>
public static partial class HtmlViewExtension
{
    /// <summary>
    /// This function returns the html content that has been proccessed from all the header includes
    /// </summary>
    /// <param name="html"></param>
    /// <returns></returns>
    public static IHtmlContent ModFrameHeader(this IHtmlHelper html)
    {
        return html.Partial(ModFrame.headerInclude);        
    }
}



