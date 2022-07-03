using System.Threading.Tasks;
using Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi
{
    [ApiController]
    public class UserController : BragControllerBase
    {

        public UserController(IMediatorResult mediator)
            : base(mediator) {}

        [HttpGet]
        [Authorize]
        [Route("User")]
        public async Task<ActionResult<AppUser>> GetAppUser()
        {
            var result = await Task.FromResult(GetUserFromClaims());
            return ToResponse(result);
        }

        [HttpGet]
        [Authorize]
        [Route("FullUser")]
        public async Task<ActionResult<AppUser>> GetFullUser()
        {
            var result = await GetUserFromClaims()
                .Bind(user => _mediator.Send(new UserEagerQuery
                {
                    User = user
                }));
            return ToResponse(result);
        }

        [HttpPut]
        [Authorize]
        [Route("User")]
        public async Task<ActionResult<AppUser>> UpdateUser(AppUser user)
        {
            //TODO:  validate that user data coming in is same as the email from claims?
            var result = await _mediator.Send(new UpdateUserCommand()
                {
                    User = user
                });

            return ToResponse(result);
        }
    }
}