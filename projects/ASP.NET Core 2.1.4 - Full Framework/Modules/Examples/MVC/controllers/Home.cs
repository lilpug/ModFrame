using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

public partial class HomeController : MyController
{   
    [Route("")]   
    public IActionResult Index()
    {
        //Sets the variable so the includes of css and js will pull through
        ViewData["homePage"] = true;
        
        return this.ModuleView("Examples", "MVC", "Index.cshtml");        
    }

    //This demonstrates how to use a different layout than default for a page in ModFrame
    [ModFrameLayouts.AnotherLayout]
    [Route("another_layout")]
    public IActionResult AnotherLayout()
    {
        //Sets the variable so the includes of css and js will pull through
        ViewData["homePage"] = true;

        return this.ModuleView("Examples", "MVC", "Index.cshtml");
    }

    //This demonstrates how to use a basic Async method
    [Route("async_demo")]
    public async Task<IActionResult> AsyncDemo()
    {
        //Sets the variable so the includes of css and js will pull through
        ViewData["homePage"] = true;

        //Awaits for a task to be completed async
        await Task.Delay(1000);

        //Returns the view
        return this.ModuleView("Examples", "MVC", "Index.cshtml");
    }
}