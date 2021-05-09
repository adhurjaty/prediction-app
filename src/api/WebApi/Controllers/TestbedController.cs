using System.Data;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Dapper;

namespace WebApi
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class TestbedController : ControllerBase
    {
        private readonly IDbConnection _db;

        public TestbedController(IDbConnection db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<string> Value()
        {
            return await _db.QuerySingleOrDefaultAsync<string>("SELECT display_name FROM users");
        }
    }
}