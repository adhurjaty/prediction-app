using Infrastructure;

namespace WebApi
{
    [Alias("users")]
    public class AppUser : DbModel
    {
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public string PrestigeAddress { get; set; }
        public string MainnetAddress { get; set; }
        public string PrestigePrivateKey { get; set; }
    }
}