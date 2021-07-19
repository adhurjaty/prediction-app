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
            return newId > 0
                ? Result.Succeeded(this as DbModel)
                : Result<DbModel>.Failed($"Could not insert record {GetType().Name} with ID: {Id}");
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
            var numUpdated = await db.Update<T>(this as T, token: token);
            return numUpdated > 0
                ? Result.Succeeded(this as DbModel)
                : Result<DbModel>.Failed($"Could not update record {GetType().Name} with ID: {Id}");
        }
    }
}