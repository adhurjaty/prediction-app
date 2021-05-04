using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace WebApi
{
    public interface IGoogle
    {
        Task<GoogleOauthResponse> Confirm(GoogleCodeRequest request);
    }

    public class GoogleInterface : IGoogle
    {
        public async Task<GoogleOauthResponse> Confirm(GoogleCodeRequest request)
        {
            var client = new HttpClient();

            string json = request.ToJson();
            var payload = new StringContent(json, UnicodeEncoding.UTF8, 
                "application/json");

            var response = await client.PostAsync("https://oauth2.googleapis.com/token", payload);
            return (await response.Content.ReadAsStringAsync()).FromJson<GoogleOauthResponse>();
        }
    }

    public class GoogleOauthResponse
    {
        [JsonProperty("access_token")]
        public string AccessToken { get; set; }
        [JsonProperty("expires_in")]
        public TimeSpan ExpiresIn { get; set; }
        [JsonProperty("id_token")]
        public string IdToken { get; set; }
        [JsonProperty("refresh_token")]
        public string RefreshToken { get; set; }
        [JsonProperty("scope")]
        public string Scope { get; set; }
        [JsonProperty("token_type")]
        public string TokenType { get; set; }
    }

    public class GoogleCodeRequest
    {
        [JsonProperty("client_id")]
        public string ClientId { get; set; }
        [JsonProperty("client_secret")]
        public string ClientSecret { get; set; }
        [JsonProperty("code")]
        public string Code { get; set; }
        [JsonProperty("grant_type")]
        public string GrantType { get; set; } = "authorization_code";
        [JsonProperty("redirect_uri")]
        public string RedirectUrl { get; set; }
        [JsonProperty("access_type")]
        public string AccessType { get; set; } = "offline";
    }
}

/*
access_token	The token that your application sends to authorize a Google API request.
expires_in	The remaining lifetime of the access token in seconds.
id_token	Note: This property is only returned if your request included an identity scope, such as openid, profile, or email. The value is a JSON Web Token (JWT) that contains digitally signed identity information about the user.
refresh_token	A token that you can use to obtain a new access token. Refresh tokens are valid until the user revokes access. Note that refresh tokens are always returned for installed applications.
scope	The scopes of access granted by the access_token expressed as a list of space-delimited, case-sensitive strings.
token_type
*/