using Newtonsoft.Json;

namespace WebApi
{
    public static class PrimitiveExtensions
    {
        public static string ToJson(this object obj)
        {
            return JsonConvert.SerializeObject(obj);
        }

        public static T FromJson<T>(this string s)
        {
            return JsonConvert.DeserializeObject<T>(s);
        }
    }
}