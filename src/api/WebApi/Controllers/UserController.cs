using System.Threading.Tasks;
using Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi
{
    [ApiController]
    public class UserController : BragControllerBase
    {
        private readonly IMediatorResult _mediator;

        public UserController(IMediatorResult mediator) 
        {
            _mediator = mediator;
        }

        [HttpGet]
        [Authorize]
        [Route("User")]
        public async Task<ActionResult<AppUser>> GetAppUser()
        {
            var result = await _mediator.Send(new UserQuery
            {
                Email = GetEmailFromClaims()
            });
            return ToResponse(result);
        }

        [HttpGet]
        [Authorize]
        [Route("FullUser")]
        public async Task<ActionResult<AppUser>> GetFullUser()
        {
            var result = await _mediator.Send(new UserEagerQuery
            {
                Email = GetEmailFromClaims()
            });
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