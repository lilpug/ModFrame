﻿using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;

/// <summary>
/// <see cref="IHtmlHelper"/> extension methods.
/// </summary>
public static partial class HtmlViewExtension
{
    /// <summary>
    /// This function returns a IHtmlContent from a specified layout view
    /// </summary>
    /// <param name="html"></param>
    /// <param name="layoutName"></param>
    /// <param name="viewRoute"></param>
    /// <returns></returns>
    public static IHtmlContent LayoutView(this IHtmlHelper html, string layoutName, string viewRoute)
    {
        return html.Partial($"{ModFrame.layoutBase}/{layoutName}/views/{viewRoute}");
    }    
	
	/// <summary>
    /// This function returns a IHtmlContent from a specified layout view
    /// </summary>
    /// <param name="html"></param>
    /// <param name="layoutName"></param>
    /// <param name="viewRoute"></param>
    /// <param name="model"></param>
    /// <returns></returns>
    public static IHtmlContent LayoutView(this IHtmlHelper html, string layoutName, string viewRoute, object model)
    {
        return html.Partial($"{ModFrame.layoutBase}/{layoutName}/views/{viewRoute}", model);
    }    
}



