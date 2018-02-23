//This is an empty class simply used to ensure any functions inside it which have the IRouteBuilder parameter are run
//Note: This allows for custom routes to be defined in ModFrame without having to modify core code.
public partial class ModFrameRouting
{
    //Example usage    
    /*
    public void GetRoutes(IRouteBuilder routes)
    {
        //Adds the generic mvc routing
        routes.MapRoute
            (
                name: "default",
                template: "{controller=Home}/{action=Index}/{id?}"
            );
    }
    */
}