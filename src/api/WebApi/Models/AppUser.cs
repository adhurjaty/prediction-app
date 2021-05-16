using Infrastructure;
using ServiceStack.DataAnnotations;

namespace WebApi
{
    [Alias("users")]
    public class AppUser : DbModel
    {
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public string PrestigeAddress { get; set; }
        public string MainnetAddress { get; set; }
        [Alias("prestige_privatekey")]
        public string PrestigePrivateKey { get; set; }
    }
}