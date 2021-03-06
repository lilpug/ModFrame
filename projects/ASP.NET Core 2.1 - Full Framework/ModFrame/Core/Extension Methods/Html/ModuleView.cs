﻿using Microsoft.AspNetCore.Html;
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
	/// <param name="moduleGroupName"></param>
    /// <param name="moduleName"></param>
    /// <param name="viewRoute"></param>
    /// <returns></returns>
    public static IHtmlContent ModuleView(this IHtmlHelper html, string moduleGroupName, string moduleName, string viewRoute)
    {
        return html.Partial($"{ModFrame.moduleBase}{moduleGroupName}/{moduleName}/views/{viewRoute}");
    }    
	
	/// <summary>
    /// This function returns a IHtmlContent from a specified module view
    /// </summary>
    /// <param name="html"></param>
	/// <param name="moduleGroupName"></param>
    /// <param name="moduleName"></param>
    /// <param name="viewRoute"></param>
	/// <param name="model"></param>
    /// <returns></returns>
    public static IHtmlContent ModuleView(this IHtmlHelper html, string moduleGroupName, string moduleName, string viewRoute, object model)
    {
        return html.Partial($"{ModFrame.moduleBase}{moduleGroupName}/{moduleName}/views/{viewRoute}", model);
    }    
}



