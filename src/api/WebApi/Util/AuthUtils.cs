using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace WebApi
{
    public static class AuthUtils
    {
        public static Task ExtractToken(
            MessageReceivedContext rawContext)
        {
            if(rawContext is null) throw new ArgumentException("rawContext is null");

            string authHeader = rawContext.Request.Headers["Authorization"]; //// Here we are using string instead of var on purpose

            var headerToken = authHeader != null && authHeader.StartsWith("Bearer ")
                ? authHeader.Substring("Bearer ".Length).Trim()
                : null;

            rawContext.Token = headerToken ?? rawContext.Token;
            return Task.CompletedTask;
        }
    }
}