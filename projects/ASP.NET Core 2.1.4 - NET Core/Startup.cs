using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc.Razor;

namespace ModFrameProject
{
    public class Startup
    {
        // This function also now uses dependency injection to add the hosting environment for ModFrame
        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            // Sets the configuration from the one supplied
            Configuration = configuration;

            // Stores it in the ModFrame global config for usage later
            ModFrame.ConfigReader = Configuration;

            // Stores the application root path in ModFrame for later use
            ModFrame.theApplicationPath = env.ContentRootPath;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Tells it to use the generic session timeout loaded from the configuration file
            services.AddSession(o =>
            {
                o.IdleTimeout = TimeSpan.FromMinutes(HostConfig.Core.SessionTimeout);
            });

            // Adds MVC to the services
            services.AddMvc();

            // Extends the original razor view service with our own
            services.Configure<RazorViewEngineOptions>(o =>
            {
                //Note: This is general not used as we have our own view extensions for layouts, modules and the global folder but have left in for usability
                var expander = new ModFrame.ViewExtender();
                o.ViewLocationExpanders.Add(expander);
            });

            // Adds the ability to use the anti forgey token in MVC
            services.AddAntiforgery();

            // Increase the max upload compared to what it actually is
            services.Configure<FormOptions>(x =>
            {
                // Max int is basically 2gb
                x.ValueLengthLimit = int.MaxValue;
                x.MultipartBodyLengthLimit = int.MaxValue; // In case of multipart
                x.MultipartHeadersLengthLimit = int.MaxValue;

            });

            // Adds the extra view to string Services into the pipeline so it can be dependency injected
            services.AddScoped<IViewRenderService, ViewRenderService>();

            // Adds the compression service
            services.AddResponseCompression(options =>
            {
                options.Providers.Add<GzipCompressionProvider>();
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {   
                app.UseDeveloperExceptionPage();
                app.UseBrowserLink();
            }
            else
            {
                app.UseExceptionHandler("/error/status/500");
            }

            // Registers status codes against an output page if something goes wrong *i.e. 404 etc*
            // Note: found in modules/core/status codes
            app.UseStatusCodePagesWithRedirects("/error/status/{0}");

            app.UseStaticFiles();
            
            // Adds compression to the response
            app.UseResponseCompression();

            // Adds the session library
            // Note: Session registration needs to be before mvc
            app.UseSession();

            // Configures the generic MVC routing
            app.UseMvc(routes =>
            {
                ModFrame.CoreRoutesLoader(routes);
            });

            // Loads any functions which have been hooked onto the boot loader
            ModFrameLauncher.Load();
        }
    }
}
