using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Luxena;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Internal;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Onko.Core;
using Onko.Core.Impl;
using Onko.Core.Interfaces;
using OnkoDiploma.Infrastructure;

namespace OnkoDiploma
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            Configuration = configuration;

            Environment = env;
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
            services.AddScoped<EncryptManager>();

            services.AddRouting();
            services.AddMvc();
            
        }   

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            Logger.Configure(loggerFactory);

            loggerFactory.AddConsole(Configuration.GetSection("Logging"));

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }


            app.UseUrlRewrites(Environment.WebRootFileProvider);

            app
                .UseStaticFiles()
                .UseDefaultFiles();
            app.UseMvc();
        }
    }
}
