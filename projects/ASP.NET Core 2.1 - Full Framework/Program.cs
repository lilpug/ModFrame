using System.IO;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ModFrameProject
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost(args)
              .Run();
        }

        public static IWebHost BuildWebHost(string[] args)
        {
            return WebHost.CreateDefaultBuilder()
              .ConfigureAppConfiguration(ConfigConfiguration) //Changes the default configuration file path to use
              .ConfigureLogging(ConfigureLogger) //Changes the default logging configuration to load
			  //.UseApplicationInsights()
              .UseStartup<Startup>()
              .Build();
        }

        // Use this for EF Tooling and not the other
        /*public static IWebHost BuildWebHost(string[] args)
        {
            return WebHost.CreateDefaultBuilder()
              .ConfigureAppConfiguration((ctx, cfg) =>
              {
                  cfg.SetBasePath(Directory.GetCurrentDirectory())
                  .AddJsonFile("config.json", true) // require the json file!
                  .AddEnvironmentVariables();
              })
              .ConfigureLogging((ctx, logging) => { }) // No logging
              .UseStartup<Startup>()
              .UseSetting("DesignTime", "true")
              .Build();


            //Example usage
            //if (_config["DesignTime"] != "true")
            //{
              //using (var scope = app.ApplicationServices.CreateScope())
              //{
                //var initializer = scope.ServiceProvider.GetRequiredService<YourSampleDataInitializer>();
                //initializer.RunAsync().Wait();
              //}
            //}
        }*/

        static void ConfigConfiguration(WebHostBuilderContext ctx, IConfigurationBuilder config)
        {
            // Wipes the default configuration file loaded by ASP Core
            config.Sources.Clear();

            //Sets up the new configuration path for our config file
            config.SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "ModFrame", "config"))
              .AddJsonFile("config.json", false, true)
              .AddEnvironmentVariables();
        }

        static void ConfigureLogger(WebHostBuilderContext ctx, ILoggingBuilder logging)
        {   
            // Setups up the logging configuration from the location of our json config information
            logging.AddConfiguration(ctx.Configuration.GetSection("Logging"));
            logging.AddConsole();
            logging.AddDebug();
        }
    }
}
