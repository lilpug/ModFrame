using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
public static partial class ModFrame
{
    private static void RegisterRoutes(IApplicationBuilder app)
    {
        //Loads the MVC routes supplied
        app.UseMvc(routes =>
        {
            CoreRoutesLoader(routes);
        });        
    }    
}