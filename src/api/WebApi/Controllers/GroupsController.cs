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

        public GroupsController(IDatabaseInterface db, IMediatorResult mediator) : base(db)
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

        [HttpGet]
        [Authorize]
        [Route("Group/{groupId}")]
        public async Task<ActionResult<Group>> GetGroup(string groupId)
        {
            var result = await (await GetUser())
                .Bind(user => _mediator.Send(new GroupByIdQuery()
                {
                    UserId = user.Id,
                    GroupId = groupId
                }));
                
            return ToResponse(result);
        }

        [HttpPost]
        [Authorize]
        [Route("Group")]
        public async Task<ActionResult<Group>> CreateGroup(Group newGroup)
        {
            var command = new CreateGroupCommand()
            {
                Name = newGroup.Name
            };
            var result = await (await (await GetUser())
                .Tee(user => command.User = user)
                .Bind(user => _mediator.Send(command)))
                .Bind(() => _db.LoadSingleResultById<Group>(command.GroupId));
            
            return ToResponse(result);
        }

        [HttpPut]
        [Authorize]
        [Route("Group/{groupId}")]
        public async Task<ActionResult<Group>> UpdateGroup(string groupId, Group group)
        {
            var result = await (await (await GetUser())
                .Bind(user => _mediator.Send(new UpdateGroupCommand()
                {
                    Group = group
                })))
                .Bind(() => _db.LoadSingleResultById<Group>(groupId));

            return ToResponse(result);
        }

        [HttpDelete]
        [Authorize]
        [Route("Group/{groupId}")]
        public async Task<ActionResult> DeleteGroup(string groupId)
        {
            var result = await (await GetUser())
                .Bind(user => _mediator.Send(new DeleteGroupCommand()
                {
                    GroupId = groupId
                }));

            return ToResponse(result);
        }
    }
}