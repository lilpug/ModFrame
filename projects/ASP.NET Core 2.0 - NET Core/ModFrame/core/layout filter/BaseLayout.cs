using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
namespace ModFrameBase.Filters
{
    //####################################################
    //########         Core Base Layout Filter    ########
    //####################################################

    //This can be used on each controller to choose which menu to use

    /// <summary>
    /// This class is to be used as the base layout action filter
    /// </summary>
    public class BaseLayout : ActionFilterAttribute
    {
        //Variables to override

        /// <summary>
        /// Stores the layout name
        /// </summary>
        public string layoutName = "Default Layout";

        /// <summary>
        /// Stores the ViewData include name for the layout
        /// </summary>
        public string includeViewDataName = "defaultLayout";

        /// <summary>
        /// Stores the master page location for the layout
        /// </summary>
        public string masterPageLocation = "~/layouts/Structures/default/views/main.cshtml";

        /// <summary>
        /// This base function adds the ViewData flag from the includeViewDataName variable
        /// </summary>
        /// <param name="filterContext"></param>
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (filterContext.Controller is Controller c)
            {
                c.ViewData[includeViewDataName] = true;
            }
        }
        
        /// <summary>
        /// This base function tells the page loader which master page it should be using from the masterPageLocation variable
        /// </summary>
        /// <param name="filterContext"></param>
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