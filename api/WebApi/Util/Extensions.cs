using System.Collections.Generic;
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

        public static U GetValueOrDefault<T, U>(this IDictionary<T, U> dict, T key)
        {
            if (dict.TryGetValue(key, out U value))
                return value;
            return default(U);
        }
    }
}