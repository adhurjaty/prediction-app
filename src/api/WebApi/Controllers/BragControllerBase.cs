using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace WebApi
{
    public abstract class BragControllerBase : ControllerBase
    {
        protected readonly IDatabaseInterface _db;

        public BragControllerBase(IDatabaseInterface db) {
            _db = db;
        }

        protected async Task<Result<AppUser>> GetUserFromClaims()
        {
            return await User.Claims
                .Where(x => x.Type.EndsWith("emailaddress"))
                .Select(res => res.Value)
                .Select(email => _db.Single<AppUser>(x => x.Email == email))
                .FirstOrDefault()
                ?? Result.Failed<AppUser>($"No email address claims exist");
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