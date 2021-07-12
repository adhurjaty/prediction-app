using System;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Infrastructure;
using ServiceStack.DataAnnotations;
using ServiceStack.OrmLite;

namespace WebApi
{
    [Alias("propositions")]
    public class Proposition : DbModel
    {
        public string GroupId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public bool? Result { get; set; }

        public override async Task<Result<DbModel>> Delete(IDbConnection db, CancellationToken token = default)
        {
            return await Delete<Proposition>(db, token);
        }

        public override async Task<Result<DbModel>> Insert(IDbConnection db, CancellationToken token = default)
        {
            return await Insert<Proposition>(db, token);
        }
    }
}