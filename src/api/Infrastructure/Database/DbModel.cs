using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using ServiceStack.OrmLite;

namespace Infrastructure
{
    public abstract class DbModel
    {
        [Column("id")]
        public Guid Id { get; set; }

        public abstract Task<Result<DbModel>> Insert(IDatabaseInterface db, 
            CancellationToken token = default);

        public abstract Task<Result<DbModel>> Delete(IDatabaseInterface db, 
            CancellationToken token = default);

        public abstract Task<Result<DbModel>> Update(IDatabaseInterface db,
            CancellationToken token = default);

        protected async Task<Result<DbModel>> Insert<T>(IDatabaseInterface db, 
            CancellationToken token = default) where T : DbModel
        {
            if(Id == default)
                Id = Guid.NewGuid();
            var newId = await db.Insert<T>(this as T, token: token);
            return Result.Succeeded(this as DbModel);
        }

        protected async Task<Result<DbModel>> Delete<T>(IDatabaseInterface db, 
            CancellationToken token = default) where T : DbModel
        {
            return (await db.DeleteResult<T>(this as T, token: token))
                .Map(_ => this as DbModel);
        }

        protected async Task<Result<DbModel>> Update<T>(IDatabaseInterface db,
            CancellationToken token = default) where T : DbModel
        {
            return (await db.UpdateResult<T>(this as T, token: token))
                .Map(_ => this as DbModel);
        }
    }
}