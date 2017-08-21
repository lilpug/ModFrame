using Microsoft.AspNetCore.Builder;
public static partial class ModFrame
{
    /// <summary>
    /// This function processes the additional routes if any
    /// </summary>
    /// <param name="app"></param>
    private static void RegisterRoutes(IApplicationBuilder app)
    {
        //Loads the MVC routes supplied
        app.UseMvc(routes =>
        {
            CoreRoutesLoader(routes);
        });        
    }    
}