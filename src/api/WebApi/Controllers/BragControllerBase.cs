using System.Data;
using System.Threading.Tasks;
using Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace WebApi
{
    public abstract class BragControllerBase : ControllerBase
    {
        protected IDbConnection _db;

        public BragControllerBase(IDbConnection db)
        {
            _db = db;
        }

        protected async Task<Result<AppUser>> GetUser()
        {
            return await User.Claims.FirstResult(x => x.Type == "email")
                .Map(res => res.Value)
                .Bind(email => _db.SingleResult<AppUser>(x => x.Email == email));
        }

        protected ActionResult<T> ToResponse<T>(Result<T> result)
        {
            return result.IsSuccess
                ? Ok(result.Success)
                : UnprocessableEntity() as ActionResult<T>;
        }
    }
}