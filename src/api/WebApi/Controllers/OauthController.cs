using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;
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

            var handler = new JwtSecurityTokenHandler();
            var token = handler.ReadJwtToken(jwt);

            return jwt;
        }
    }

    public class OauthConfirmRequest
    {
        public string Code { get; set; }
        public string Verifier { get; set; }
    }
}