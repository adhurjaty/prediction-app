using Xunit;
using FluentAssertions;
using System.Threading.Tasks;
using Moq;
using System.Net.Http;

namespace WebApi.Test
{
    public class OauthTests
    {
        [Fact]
        public async Task OauthReponseParseSuccess()
        {
            // string testString = "{\n  \"access_token\": \"ya29.a0AfH6SMAUKV_oXOwy_XYWl1hqwKUfoHnyZZD-ZWOVUNxHucR1p75Ayq0g5MDT5zSjbGw6Iuan6wrKeuhV4ZgF0iG2hVEZ1-Hs7rs2mFT9Vgs_X8wsDaSn_tIciz_NV8BCAFv2zknkvYru18yLjPfgpK26rtgM\",\n  \"expires_in\": 3599,\n  \"scope\": \"openid https://www.googleapis.com/auth/userinfo.email\",\n  \"token_type\": \"Bearer\",\n  \"id_token\": \"eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc3MjA5MTA0Y2NkODkwYTVhZWRkNjczM2UwMjUyZjU0ZTg4MmYxM2MiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0NjY5MTY5ODM1NDQtdDdtNDBiOGhuMDQ3bTl2NWhjYmdyOXEydnQ2aHNhdm0uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0NjY5MTY5ODM1NDQtdDdtNDBiOGhuMDQ3bTl2NWhjYmdyOXEydnQ2aHNhdm0uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE5MjQ2MzgxNzcwODI4NjA2MzciLCJlbWFpbCI6ImFkaHVyamF0eUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IkNfeWdIUElvamZNUm10MjhOVExXN2ciLCJpYXQiOjE2MjAwOTQzMTAsImV4cCI6MTYyMDA5NzkxMH0.jpvdX9Tm4z9cJq3chdFOcgS1mO1FCPfUgUkeentHBots41rAFemaMYVhHBnxuuafkmyQrbAJ7gjHs0rFfopFiRvjajo5uMKOInql-KBERO3DThILpWjNicA8Bj5mq1xeXUjFlhbElas6EuxSVdSW9gm8RFOh_8j07G0PoKI3aNtTo532cY24VKmj6270hai5WCZCzkeyUAURkJfAvwSWg-TEJykt6M68mFDf-eQ_VnK2JYJw2hJMx17W_Z5Br1taWAwna4ylgVLqUtnBbNYA3Oa1q4imqUD5OuKXpIWNZ1Z87bWQuNwecABLkGHDKFtpyqV0it9jcXfFB2d00jVb6A\"\n}";
            // var fx = new OauthTestFixture()
            //     .WithOauthResponse(new )
        }
    }

    internal class OauthTestFixture
    {
        private readonly Mock<IHttp> _httpMock = new Mock<IHttp>();

        public OauthTestFixture WithOauthResponse(HttpResponseMessage response)
        {
            _httpMock.Setup(x => x.PostAsync(It.IsAny<string>(), It.IsAny<object>()))
                .ReturnsAsync(response);
            return this;
        }
    }
}
