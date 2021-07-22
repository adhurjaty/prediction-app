using System;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Infrastructure;
using ServiceStack.DataAnnotations;
using ServiceStack.OrmLite;

namespace WebApi
{
    [Alias("bets")]
    public class Bets : DbModel
    {
        public string GroupId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public bool? Result { get; set; }

        public override async Task<Result<DbModel>> Delete(IDatabaseInterface db, CancellationToken token = default)
        {
            return await Delete<Bets>(db, token);
        }

        public override async Task<Result<DbModel>> Insert(IDatabaseInterface db, CancellationToken token = default)
        {
            return await Insert<Bets>(db, token);
        }

        public override async Task<Result<DbModel>> Update(IDatabaseInterface db, CancellationToken token = default)
        {
            return await Update<Bets>(db, token);
        }
    }
}