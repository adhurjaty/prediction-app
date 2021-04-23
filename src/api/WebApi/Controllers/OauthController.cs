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

        public OauthController(ILogger<OauthController> logger,
            AuthConfig authConfig)
        {
            _logger = logger;
            _authConfig = authConfig;
        }

        [HttpPost]
        public string CodeLogin(OauthConfirmRequest request)
        {
            var oauthRequest = new GoogleCodeRequest()
            {
                ClientId = _authConfig.ClientId,
                ClientSecret = _authConfig.ClientSecret,
                Code = request.Code,
                CodeVerifier = request.Verifier,
                RedirectUrl = _authConfig.RedirectUrl
            };

            return oauthRequest.ToJson();
        }
    }

    public class OauthConfirmRequest
    {
        public string Code { get; set; }
        public string Verifier { get; set; }
    }

    public class GoogleCodeRequest
    {
        [JsonProperty("client_id")]
        public string ClientId { get; set; }
        [JsonProperty("client_secret")]
        public string ClientSecret { get; set; }
        [JsonProperty("code")]
        public string Code { get; set; }
        [JsonProperty("code_verifier")]
        public string CodeVerifier { get; set; }
        [JsonProperty("grant_type")]
        public string GrantType { get; set; } = "authorization_code";
        [JsonProperty("redirect_url")]
        public string RedirectUrl { get; set; }
    }
}