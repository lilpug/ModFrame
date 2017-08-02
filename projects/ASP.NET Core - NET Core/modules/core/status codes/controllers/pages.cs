using Microsoft.AspNetCore.Mvc;

public partial class StatusCodesController : MyController
{   
    [Route("error/status/{code}")]   
    public IActionResult GeneralStatus(int? code)
    {
        //Sets the variable so the includes of css and js will pull through
        ViewData["statusPages"] = true;

        return this.ModuleView("core", "status codes", "error.cshtml", code);        
    }
}


