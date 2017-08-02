using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
namespace ModFrameBase.Filters
{
    //####################################################
    //########         Core Base Layout Filter    ########
    //####################################################

    //This can be used on each controller to choose which menu to use
    public class BaseLayout : ActionFilterAttribute
    {
        //Variables to override
        public string layoutName = "Default Layout";
        public string includeNames = "defaultLayout";
        public string masterPageLocation = "~/layouts/Structures/default/views/main.cshtml";

        //Core function for adding the viewdata name for includes to work
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (filterContext.Controller is Controller c)
            {
                c.ViewData[includeNames] = true;
            }
        }

        //Tells the page loader which master page it should be using
        public override void OnResultExecuting(ResultExecutingContext filterContext)
        {
            if (filterContext.HttpContext.Request.Method != "POST" && !filterContext.HttpContext.Request.IsAjaxRequest())
            {
                //If data then define the master layout
                if (filterContext.Result is ViewResult viewResult)
                {
                    if (filterContext.Controller is Controller c)
                    {
                        c.ViewData["masterPageLocation"] = masterPageLocation;
                    }
                }
            }
        }
    }
}