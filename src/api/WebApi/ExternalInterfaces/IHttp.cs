using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace WebApi
{
    public interface IHttp
    {
        Task<HttpResponseMessage> PostAsync(string url, object payload);
    }

    public class HttpWrapper : IHttp
    {
        private readonly HttpClient _client = new HttpClient();

        public async Task<HttpResponseMessage> PostAsync(string url, object payload)
        {
            string json = payload.ToJson();
            var postPayload = new StringContent(json, UnicodeEncoding.UTF8, 
                "application/json");
            return await _client.PostAsync(url, postPayload);
        }
    }
}