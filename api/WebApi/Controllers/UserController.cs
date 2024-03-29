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
            string email = Request.Query["email"];
            var result = !string.IsNullOrEmpty(email) && email != "undefined"
                ? await GetUserFromEmail(email)
                : await Task.FromResult(GetUserFromClaims());
            return ToResponse(result);
        }

        private async Task<Result<AppUser>> GetUserFromEmail(string email)
        {
            return (await _mediator.Send(new UserQuery()
            {
                Email = email
            }))
            .Tee(user => 
            {
                // remove private data
                user.FriendsRelations = null;
            });
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

        [HttpPost]
        [Authorize]
        [Route("User")]
        public async Task<ActionResult<AppUser>> CreateUser(CreateUserRequest request)
        {
            var result = await _mediator.Send(new CreateUserCommand()
            {
                Email = GetEmailFromClaims(),
                DisplayName = request.DisplayName,
                FlowAddress = request.FlowAddress
            });
            return ToResponse(result);
        }

        [HttpGet]
        [Authorize]
        [Route("Users/emails")]
        public async Task<ActionResult<string[]>> GetUserEmails()
        {
            string search = Request.Query["search"];
            var result = await _mediator.Send(new SearchEmailsQuery()
            {
                Search = search,
                Limit = 5
            });
            return ToResponse(result);
        }
    }

    public class CreateUserRequest
    {
        public string DisplayName { get; set; }
        public string FlowAddress { get; set; }
    }
}