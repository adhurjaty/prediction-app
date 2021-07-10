using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Threading.Tasks;

namespace Infrastructure
{
    public abstract class DbModel
    {
        [Column("id")]
        public Guid Id { get; set; }

        public virtual async Task<Result<DbModel>> Insert(IDbConnection db)
        {
            if(Id == default)
                Id = Guid.NewGuid();

            return await db.InsertResult(this);
        }
    }
}