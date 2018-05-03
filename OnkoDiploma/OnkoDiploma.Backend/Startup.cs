using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Onko.Core;
using Onko.Core.Impl;
using Onko.Core.Interfaces;
using Luxena;
using Onko.Core.Services;
using OnkoDiploma.Backend.Infrastructure;
using OnkoDiploma.Infrastructure;

namespace OnkoDiploma.Backend
{
    public class Startup
    {
        public static void Main(string[] args)
        {
            var host = new WebHostBuilder()
                .UseKestrel()
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseConfiguration(new ConfigurationBuilder()
                    .AddEnvironmentVariables()
                    .AddCommandLine(args)
                    .Build())
                .UseStartup<Startup>()
                .Build();

            host.Run();
        }

        public Startup(IHostingEnvironment env)
        {
            Environment = env;

            Configuration = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("config.json", false, true)
                .AddJsonFile($"config.{env.EnvironmentName.ToLower()}.json", true)
                .Build();
        }

        public IConfiguration Configuration { get; set; }
        public IHostingEnvironment Environment { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            Settings.Instance = Configuration.GetSection("Core").Get<Settings>();

            services.AddScoped<Session>();
            services.AddScoped<ILocalizationManager, LocalizationManager>();
            services.AddScoped<QuestionsManager>();
            services.AddScoped<PersonManager>();
            services.AddScoped<AuthService>();
            services.AddScoped<EncryptManager>();
            services.AddScoped<ProfileService>();
            services.AddScoped<IClientEvents, ClientEvents>();

            services.AddRouting();
            services.AddMvc();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, ILoggerFactory loggerFactory)
        {
            Logger.Configure(loggerFactory);

            loggerFactory.AddConsole(Configuration.GetSection("Logging"));

            if (Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseAuth();


            app.UseUrlRewrites(Environment.WebRootFileProvider);

            app.UseStaticFiles();

            app.UseMvc();
        }
    }
}
