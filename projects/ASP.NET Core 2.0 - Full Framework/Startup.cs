﻿using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ModFrameProject
{
    public class Startup
    {
        // This function also now uses dependency injection to add the hosting enviroment for ModFrame
        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            // Sets the configuration from the one supplied
            Configuration = configuration;

            // Boots up the ModFrame application startup function
            ModFrame.ApplicationStartup(env, Configuration);
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Adds the ModFrame services to the services container.            
            ModFrame.ServiceSetup(services);
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
                app.UseExceptionHandler("~/error/status/500");
            }

            // Registers status codes against an output page if something goes wrong *i.e. 404 etc*
            // Note: found in modules/core/status codes
            app.UseStatusCodePagesWithRedirects("~/error/status/{0}");

            app.UseStaticFiles();

            // Add the ModFrame modifications to the request pipeline.            
            ModFrame.AppSetup(app);
        }
    }
}