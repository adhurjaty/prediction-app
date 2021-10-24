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
        private readonly IDatabaseInterface _db;
        private readonly IMediatorResult _mediator;

        public GroupsController(IDatabaseInterface db, IMediatorResult mediator)
        {
            _db = db;
            _mediator = mediator;
        }

        [HttpGet]
        [Authorize]
        [Route("Groups")]
        public async Task<ActionResult<List<Group>>> GetGroups()
        {
            var result = await _mediator.Send(new GroupsByUserQuery()
            {
                Email = GetEmailFromClaims()
            });
                
            return ToResponse(result);
        }

        [HttpGet]
        [Authorize]
        [Route("Group/{groupId}")]
        public async Task<ActionResult<Group>> GetGroup(string groupId)
        {
            var result = await _mediator.Send(new GroupByIdQuery()
            {
                Email = GetEmailFromClaims(),
                GroupId = groupId
            });
                
            return ToResponse(result);
        }

        [HttpPost]
        [Authorize]
        [Route("Group")]
        public async Task<ActionResult<Group>> CreateGroup(Group newGroup)
        {
            var command = new CreateGroupCommand()
            {
                Name = newGroup.Name,
                Email = GetEmailFromClaims()
            };
            var result = await (await _mediator.Send(command))
                .Bind(() => _db.LoadSingleById<Group>(command.GroupId));
            
            return ToResponse(result);
        }

        [HttpPut]
        [Authorize]
        [Route("Group/{groupId}")]
        public async Task<ActionResult<Group>> UpdateGroup(string groupId, Group group)
        {
            var result = await (await _mediator.Send(new UpdateGroupCommand()
                {
                    Email = GetEmailFromClaims(),
                    Group = group
                }))
                .Bind(() => _db.LoadSingleById<Group>(groupId));

            return ToResponse(result);
        }

        [HttpDelete]
        [Authorize]
        [Route("Group/{groupId}")]
        public async Task<ActionResult> DeleteGroup(string groupId)
        {
            var result = await _mediator.Send(new DeleteGroupCommand()
            {
                Email = GetEmailFromClaims(),
                GroupId = groupId
            });

            return ToResponse(result);
        }
    }
}