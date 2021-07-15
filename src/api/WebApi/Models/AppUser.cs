using System;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Infrastructure;
using ServiceStack.DataAnnotations;
using ServiceStack.OrmLite;

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

        public override async Task<Result<DbModel>> Delete(IDatabaseInterface db, CancellationToken token = default)
        {
            return await Delete<AppUser>(db, token);
        }

        public override async Task<Result<DbModel>> Insert(IDatabaseInterface db, CancellationToken token = default)
        {
            return await Insert<AppUser>(db, token);
        }
    }
}