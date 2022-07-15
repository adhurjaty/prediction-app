using System.Linq;
using System.Threading.Tasks;
using Infrastructure;
using Microsoft.AspNetCore.Http;

namespace WebApi
{
    public class UserFromClaimsMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IMediatorResult _mediator;

        public UserFromClaimsMiddleware(RequestDelegate next, IMediatorResult mediator)
        {
            _next = next;
            _mediator = mediator;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            context.Items["UserResult"] = await context.User.Claims
                .Where(x => x.Type.EndsWith("emailaddress"))
                .Select(res => res.Value)
                .Select(email => _mediator.Send(new UserQuery()
                {
                    Email = email
                }))
                .FirstOrDefault()
                ?? Result.Failed<AppUser>($"No email address claims exist");
                
            await _next(context);
        }
    }
}