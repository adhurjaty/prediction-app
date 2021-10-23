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
    }
}