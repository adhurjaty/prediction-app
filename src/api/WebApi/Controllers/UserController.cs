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
    public class UserController : BragControllerBase
    {
        private readonly IDatabaseInterface _db;
        private readonly IMediatorResult _mediator;

        public UserController(IDatabaseInterface db, IMediatorResult mediator) 
        {
            _db = db;
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

        [HttpPost]
        [Route("User")]
        public async Task<ActionResult<AppUser>> CreateUser(AppUser newUser)
        {
            var command = new CreateUserCommand()
            {
                DisplayName = newUser.DisplayName,
                Email = newUser.Email
            };
            var result = await _mediator.Send(command);
            return ToResponse(result);
        }
    }
}