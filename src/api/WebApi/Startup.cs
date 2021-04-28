using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MediatR;
using System.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Cors.Infrastructure;

namespace WebApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<BlockchainSettings>(x =>
                Configuration.GetSection("BlockchainSettings")
                .Get<BlockchainSettings>());

            var googleSettings = Configuration.GetSection("GoogleConfig")
                .Get<AuthConfig>();

            services.AddSingleton<AuthConfig>(x => googleSettings);

            services.AddSingleton<IWeb3, Web3Wrapper>();
            services.AddSingleton<ContractFactory>(x => 
            {
                string json = File.ReadAllText("./Contract/combined.json");
                return new ContractFactory(
                    x.GetService<BlockchainSettings>(),
                    json);
            });

            services.AddSingleton<EqualAntePropositionDeploy>(x =>
            {
                var factory = x.GetService<ContractFactory>();
                var contractInfo = factory.GetContractInfo("EqualAnteProposition");
                EqualAntePropositionDeploy.ByteCode = contractInfo.Bin;
                return new EqualAntePropositionDeploy()
                {
                    Title = "Test Contract"
                };
            });

            services.AddSingleton<IGoogle, GoogleInterface>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(jwt => jwt.UseGoogle(googleSettings.ClientId));

            services.AddMediatR(typeof(Startup));

            // services.AddAuthentication(options =>
            // {
            //     options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            //     options.DefaultAuthenticateScheme = OpenIdConnectDefaults.AuthenticationScheme;
            // }).AddCookie(options =>
            // {
            //     options.LoginPath = 
            // })

            services.AddCors(options => {
                var corsPolicy = new CorsPolicyBuilder()
                    .AllowAnyMethod()
                    .AllowAnyOrigin()
                    .AllowAnyHeader()
                    .Build();

                options.AddPolicy("allow-localhost", corsPolicy);
            });

            services.AddControllers();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            // app.UseAuthentication();
            // app.Use(async (context, next) =>
            // {
            //     if(!context.User.Identity?.IsAuthenticated ?? false)
            //     {
            //         context.Response.StatusCode = 401;
            //         await context.Response.WriteAsync("Not Authenticated");
            //     }
            //     else
            //     {
            //         await next();
            //     }
            // });

            // app.UseHttpsRedirection();

            app.UseCors("allow-localhost");

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
