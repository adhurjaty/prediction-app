using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi
{
    [ApiController]
    public class GroupsController : BragControllerBase
    {
        private readonly IMediatorResult _mediator;

        public GroupsController(IDbConnection db, IMediatorResult mediator) : base(db)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [Authorize]
        [Route("Groups")]
        public async Task<ActionResult<List<Group>>> GetGroups()
        {
            var result = await (await GetUser())
                .Bind(user => _mediator.Send(new GroupsByUserQuery()
                {
                    UserId = user.Id.ToString()
                }));
                
            return ToResponse(result);
        }
    }
}