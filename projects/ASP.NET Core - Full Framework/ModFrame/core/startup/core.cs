using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;

/* This needs adding to the startup.cs -> Startup function:-
    ModFrame.ApplicationStartup(services);
*/

/* This needs adding to the startup.cs -> ConfigureServices function:-
    ModFrame.ServiceSetup(services);
*/

/* This needs adding to the startup.cs -> Configure function:-
    ModFrame.AppSetup(app);
*/

public static partial class ModFrame
{    
    public static void ApplicationStartup(IHostingEnvironment env, IConfigurationRoot Configuration)
    {
        //Stores it in the global config for usage later
        ConfigReader = Configuration;

        //Stores the application root path in memory for later use
        theApplicationPath = env.ContentRootPath;
    }

    public static void ServiceSetup(IServiceCollection services)
    {
        //Tells it to use the generic session timeout loaded from the configuration file
        services.AddSession(o =>
        {
            o.IdleTimeout = TimeSpan.FromMinutes(HostConfig.Core.SessionTimeout);
        });
        
        //Adds MVC to the services
        services.AddMvc();

        //Extends the original razor view service with our own
        services.Configure<RazorViewEngineOptions>(o =>
        {
            var expander = new ViewExtender();
            o.ViewLocationExpanders.Add(expander);
        });

        //Adds the ability to use the anti forgey token in MVC
        services.AddAntiforgery();

        //Increase the max upload compared to what it actually is
        services.Configure<FormOptions>(x =>
        {
            //Max int is basically 2gb
            x.ValueLengthLimit = int.MaxValue;
            x.MultipartBodyLengthLimit = int.MaxValue; // In case of multipart
        });

        //Adds the extra view to string Services into the pipeline so they can be dependency injected
        services.AddScoped<IViewRenderService, ViewRenderService>();

        //Adds the compression service
        services.AddResponseCompression(options =>
        {
            options.Providers.Add<GzipCompressionProvider>();
        });
    }

    public static void AppSetup(IApplicationBuilder app)
    {
        //Adds compression to the response
        app.UseResponseCompression();

        //Note: Session registration needs to be before mvc
        app.UseSession();        

        //Configures the generic MVC routing
        RegisterRoutes(app);
        
        //Loads any functions which have been hooked onto the boot loader
        ModFrameLauncher.Load();
    }    
}