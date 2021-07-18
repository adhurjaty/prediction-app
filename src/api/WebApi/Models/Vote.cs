using System;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Infrastructure;
using ServiceStack.DataAnnotations;
using ServiceStack.OrmLite;

namespace WebApi
{
    [Alias("votes")]
    public class Vote : DbModel
    {
        public string PropositionId { get; set; }
        public bool _Vote { get; set; }

        public override async Task<Result<DbModel>> Delete(IDatabaseInterface db, CancellationToken token = default)
        {
            return await Delete<Vote>(db, token);
        }

        public override async Task<Result<DbModel>> Insert(IDatabaseInterface db, CancellationToken token = default)
        {
            return await Insert<Vote>(db, token);
        }

        public override async Task<Result<DbModel>> Update(IDatabaseInterface db, CancellationToken token = default)
        {
            return await Update<Vote>(db, token);
        }
    }
}