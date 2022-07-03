using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Infrastructure;
using WebApi;

namespace WebApi
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class OauthController : BragControllerBase
    {
        private readonly ILogger<OauthController> _logger;
        private readonly AuthConfig _authConfig;
        private readonly IGoogle _google;
        private readonly IMediatorResult _mediator;

        public OauthController(ILogger<OauthController> logger,
            AuthConfig authConfig,
            IGoogle google,
            IMediatorResult mediator)
            : base(null)
        {
            _logger = logger;
            _authConfig = authConfig;
            _google = google;
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<ActionResult<string>> CodeLogin(OauthConfirmRequest request)
        {
            var oauthRequest = new GoogleCodeRequest()
            {
                ClientId = _authConfig.ClientId,
                ClientSecret = _authConfig.ClientSecret,
                Code = request.Code,
                RedirectUrl = _authConfig.RedirectUrl
            };

            var response = await _google.Confirm(oauthRequest);
            var jwt = response.IdToken;
            var payload = await GoogleJsonWebSignature.ValidateAsync(jwt);

            return ToResponse((await (await _mediator.Send(new UserQuery()
                {
                    Email = payload.Email
                }))
                .Either(
                    _ => Task.FromResult(Result.Succeeded()),
                    _ => _mediator.Send(new CreateUserCommand()
                    {
                        Email = payload.Email,
                        DisplayName = ""
                    })))
                .Map(() => jwt));
        }

        [HttpGet]
        [Authorize]
        public IActionResult Secret()
        {
            var user = User;
            var email = User.Claims.FirstOrDefault(claim => claim.Type == "email");
            if(email is null)
                return Unauthorized();

            return Ok(email.Value);
        }
    }

    public class OauthConfirmRequest
    {
        public string Code { get; set; }
        public string Verifier { get; set; }
    }
}