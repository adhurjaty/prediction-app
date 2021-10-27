using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace WebApi
{
    public abstract class BragControllerBase : ControllerBase
    {
        protected string GetEmailFromClaims()
        {
            return User.Claims
                .Where(x => x.Type == "email")
                .Select(res => res.Value)
                .FirstOrDefault();
        }

        protected ActionResult<T> ToResponse<T>(Result<T> result)
        {
            return result.IsSuccess
                ? Ok(result.Success)
                : UnprocessableEntity(result.Failure) as ActionResult<T>;
        }

        protected ActionResult ToResponse(Result result)
        {
            return result.IsSuccess
                ? Ok()
                : UnprocessableEntity(result.Failure) as ActionResult;
        }
    }
}