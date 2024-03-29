using System.Collections.Generic;
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

        public GroupsController(IDatabaseInterface db, IMediatorResult mediator)
            : base(mediator)
        {
            _db = db;
        }

        [HttpGet]
        [Authorize]
        [Route("Groups")]
        public async Task<ActionResult<List<Group>>> GetGroups()
        {
            var result = await GetUserFromClaims()
                .Bind(user => _mediator.Send(new GroupsByUserQuery()
                {
                    User = user
                }));
                
            return ToResponse(result);
        }

        [HttpGet]
        [Authorize]
        [Route("Groups/{groupId}")]
        public async Task<ActionResult<Group>> GetGroup(string groupId)
        {
            var result = await GetUserFromClaims()
                .Bind(user => _mediator.Send(new GroupByIdQuery()
                {
                    User = user,
                    GroupId = groupId
                }));

            return ToResponse(result);
        }

        [HttpPost]
        [Authorize]
        [Route("Groups")]
        public async Task<ActionResult<Group>> CreateGroup(Group newGroup)
        {
            var result = await (await GetUserFromClaims()
                .Map(user => new CreateGroupCommand()
                {
                    Name = newGroup.Name,
                    User = user
                })
                .TeeResult(command => _mediator.Send(command)))
                .Bind(command => _db.LoadSingleById<Group>(command.GroupId));

            return ToResponse(result);
        }

        [HttpPut]
        [Authorize]
        [Route("Groups/{groupId}")]
        public async Task<ActionResult<Group>> UpdateGroup(string groupId, [FromBody] UpdateGroupRequest request)
        {
            var result = await (await GetUserFromClaims()
                .Bind(user => _mediator.Send(new UpdateGroupCommand()
                {
                    User = user,
                    Group = request.Group
                })))
                .Bind(() => _db.LoadSingleById<Group>(groupId));

            return ToResponse(result);
        }

        [HttpDelete]
        [Authorize]
        [Route("Groups/{groupId}")]
        public async Task<ActionResult> DeleteGroup(string groupId)
        {
            var result = await GetUserFromClaims()
                .Bind(user => _mediator.Send(new DeleteGroupCommand()
                {
                    User = user,
                    GroupId = groupId
                }));

            return ToResponse(result);
        }
    }

    public class UpdateGroupRequest
    {
        public Group Group { get; set; }
    }
}