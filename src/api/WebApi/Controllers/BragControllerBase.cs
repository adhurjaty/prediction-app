using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace WebApi
{
    public abstract class BragControllerBase : ControllerBase
    {
        protected readonly IMediatorResult _mediator;

        public BragControllerBase(IMediatorResult mediator) {
            _mediator = mediator;
        }

        protected string GetEmailFromClaims()
        {
            return User.Claims
                .FirstOrDefault(x => x.Type.EndsWith("emailaddress"))
                ?.Value;
        }

        protected Result<AppUser> GetUserFromClaims()
        {
            return (HttpContext.Items.GetValueOrDefault("UserResult") as Result<AppUser>)
                ?? Result.Failed<AppUser>("User from claims middleware failed");
        }

        protected ActionResult<T> ToResponse<T>(Result<T> result)
        {
            return result.IsSuccess
                ? Ok(result.Success)
                : UnprocessableEntity(result.Failure);
        }

        protected ActionResult ToResponse(Result result)
        {
            return result.IsSuccess
                ? Ok()
                : UnprocessableEntity(result.Failure);
        }
    }
}