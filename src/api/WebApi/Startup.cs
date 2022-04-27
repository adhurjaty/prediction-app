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
using System.Data;
using Npgsql;
using Infrastructure;
using ServiceStack.Data;
using ServiceStack.OrmLite;
using System.Reflection;

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
            var dbConfig = Configuration.GetSection("DbConfig").Get<DbConfig>();

            services.AddSingleton<AuthConfig>(x => googleSettings);

            var contractInterface = CreateContractInterface();
            services.AddSingleton<IContracts>(x => contractInterface);

            services.AddSingleton<IHttp, HttpWrapper>();

            services.AddSingleton<IGoogle, GoogleInterface>();

            services.AddSingleton<IDbConnectionFactory>(x => 
                new OrmLiteConnectionFactory(dbConfig.ConnectionString(), 
                    PostgreSqlDialect.Provider));
            services.AddSingleton<IDatabaseInterface>(x =>
            {
                var dbInt = new DatabaseInterface(x.GetService<IDbConnectionFactory>());
                var strategyFactory = new DbStrategyFactory(typeof(Startup).Assembly.GetTypes());
                return new ModelsDatbaseInterface(dbInt, strategyFactory);
            });

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(jwt => jwt.UseGoogle(googleSettings.ClientId));

            RegisterCQRS(services);

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

        private void RegisterCQRS(IServiceCollection services)
        {
            var types = this.GetType().Assembly.GetTypes();

            services.RegisterGenericInterface(typeof(IRequestHandler<>));
            services.RegisterGenericInterface(typeof(IRequestHandler<,>));
            services.RegisterGenericInterface(typeof(ICommandHandler<>));
            services.RegisterGenericInterface(typeof(IQueryHandler<,>));

            services.AddMediatR(typeof(Startup).GetType().Assembly);
            services.AddTransient<IMediatorResult>(x => 
                new MediatorRailway(x.GetService<IMediator>()));
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

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

        private IContracts CreateContractInterface()
        {
            try
            {
                return ContractsInterface.CreateInstance(Configuration
                    .GetSection("FlowSettings")
                    .Get<FlowConfig>())
                    .Result;   
            }
            catch (System.Exception)
            {
                return new DummyContractsInterface();
            }
        }
    }

    public static class ServiceCollectionExtensions
    {
        public static void RegisterGenericInterface(this IServiceCollection services, Type genericType)
        {
            // code from: https://stackoverflow.com/questions/56143613/inject-generic-interface-in-net-core
            var types = typeof(Startup).Assembly.GetTypes();

            types
                .Where(item => item.GetInterfaces()
                .Where(i => i.IsGenericType).Any(i => 
                    i.GetGenericTypeDefinition() == genericType) 
                    && !item.IsAbstract && !item.IsInterface)
                .ToList()
                .ForEach(assignedTypes =>
                {
                    var serviceType = assignedTypes.GetInterfaces().First(i => 
                        i.GetGenericTypeDefinition() == genericType);
                    services.AddSingleton(serviceType, assignedTypes);
                });
        }
    }
}
