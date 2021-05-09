using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace WebApi
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class OauthController : ControllerBase
    {
        private readonly ILogger<OauthController> _logger;
        private readonly AuthConfig _authConfig;
        private readonly IGoogle _google;

        public OauthController(ILogger<OauthController> logger,
            AuthConfig authConfig,
            IGoogle google)
        {
            _logger = logger;
            _authConfig = authConfig;
            _google = google;
        }

        [HttpPost]
        public async Task<string> CodeLogin(OauthConfirmRequest request)
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

            return jwt;
        }

        [HttpGet]
        [Authorize]
        public string Secret()
        {
            return "shhh, it's a secret";
        }
    }

    public class OauthConfirmRequest
    {
        public string Code { get; set; }
        public string Verifier { get; set; }
    }
}