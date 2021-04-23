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
        public async Task<GoogleOauthResponse> CodeLogin(OauthConfirmRequest request)
        {
            var oauthRequest = new GoogleCodeRequest()
            {
                ClientId = _authConfig.ClientId,
                ClientSecret = _authConfig.ClientSecret,
                Code = request.Code,
                CodeVerifier = request.Verifier,
                RedirectUrl = _authConfig.RedirectUrl
            };

            return await _google.Confirm(oauthRequest);
        }
    }

    public class OauthConfirmRequest
    {
        public string Code { get; set; }
        public string Verifier { get; set; }
    }
}