using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Routing;

//Idea From: https://ppolyzos.com/2016/09/09/asp-net-core-render-view-to-string/

//Note: The interface is required for extending the service
public interface IViewRenderService
{
    Task<string> RenderToStringAsync(ViewResult result);
    Task<string> RenderToStringAsync(string viewPath, object model = null);
}

public class ViewRenderService : IViewRenderService
{
    private readonly IRazorViewEngine _razorViewEngine;
    private readonly ITempDataProvider _tempDataProvider;
    private readonly IServiceProvider _serviceProvider;

    public ViewRenderService(IRazorViewEngine razorViewEngine,
        ITempDataProvider tempDataProvider,
        IServiceProvider serviceProvider)
    {
        _razorViewEngine = razorViewEngine;
        _tempDataProvider = tempDataProvider;
        _serviceProvider = serviceProvider;
    }


    public async Task<string> RenderToStringAsync(ViewResult result)
    {
        var httpContext = new DefaultHttpContext { RequestServices = _serviceProvider };
        var actionContext = new ActionContext(httpContext, new RouteData(), new ActionDescriptor());

        using (var sw = new StringWriter())
        {
            //Pulls the absolute view path and model from the viewresult
            //Note: the viewresult is what the engine uses normally to go and render the view
            string viewPath = result.ViewName;
            object model = result.Model;

            //This works with absolute paths
            //Note: findview does not use absolute pathss
            var viewResult = _razorViewEngine.GetView(viewPath, viewPath, false);

            if (viewResult.View == null)
            {
                throw new ArgumentNullException($"{viewPath} does not match any available view");
            }

            //Only includes the model if its not null *as its optional*
            ViewDataDictionary viewDictionary = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary());
            if (model != null)
            {
                viewDictionary = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary())
                {
                    Model = model
                };
            }

            var viewContext = new ViewContext(
                actionContext,
                viewResult.View,
                viewDictionary,
                new TempDataDictionary(actionContext.HttpContext, _tempDataProvider),
                sw,
                new HtmlHelperOptions()
            );

            await viewResult.View.RenderAsync(viewContext);
            return sw.ToString();
        }
    }
    
    public async Task<string> RenderToStringAsync(string viewPath, object model = null)
    {
        var httpContext = new DefaultHttpContext { RequestServices = _serviceProvider };
        var actionContext = new ActionContext(httpContext, new RouteData(), new ActionDescriptor());

        using (var sw = new StringWriter())
        {
            //This works with absolute paths
            //Note: findview does not use absolute pathss
            var viewResult = _razorViewEngine.GetView(viewPath, viewPath, false);

            if (viewResult.View == null)
            {
                throw new ArgumentNullException($"{viewPath} does not match any available view");
            }

            //Only includes the model if its not null *as its optional*
            ViewDataDictionary viewDictionary = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary());
            if (model != null)
            {
                viewDictionary = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary())
                {
                    Model = model
                };
            }

            var viewContext = new ViewContext(
                actionContext,
                viewResult.View,
                viewDictionary,
                new TempDataDictionary(actionContext.HttpContext, _tempDataProvider),
                sw,
                new HtmlHelperOptions()
            );

            await viewResult.View.RenderAsync(viewContext);
            return sw.ToString();
        }
    }
}
