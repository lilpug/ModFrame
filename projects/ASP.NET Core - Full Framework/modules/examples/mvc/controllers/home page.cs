using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

public partial class HomeController : MyController
{   
    [Route("")]   
    public IActionResult Index()
    {
        //Sets the variable so the includes of css and js will pull through
        ViewData["homePage"] = true;
        
        return this.ModuleView("Examples", "MVC", "index.cshtml");        
    }    
}


