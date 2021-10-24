using System;
using System.Threading;
using System.Threading.Tasks;
using Infrastructure;

namespace WebApi
{
    public class DefaultModelDbStrategy<T> : DefaultDbStrategy<T> where T : DbModel
    {
        public override async Task<Result<long>> Insert(IDatabaseInterface db, T model, CancellationToken token = default)
        {
            if(model.Id == default)
                model.Id = Guid.NewGuid();
            return await db.Insert<T>(model, token: token);
        }
    }
}