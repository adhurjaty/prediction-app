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

            services.AddMediatR(typeof(Startup));

            services.AddControllers();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
