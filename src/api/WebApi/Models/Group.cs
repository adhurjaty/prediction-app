using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Infrastructure;
using ServiceStack.DataAnnotations;
using ServiceStack.OrmLite;

namespace WebApi
{
    [Alias("groups")]
    public class Group : DbModel
    {
        public string Name { get; set; }
        public List<AppUser> Users { get; set; }

        public override async Task<Result<DbModel>> Insert(IDbConnection db)
        {
            return (await (await base.Insert(db))
                .Bind(async group => 
                {
                    return await Users.Select(async user => 
                    {
                        var userGroup = new UserGroup()
                        {
                            UserId = user.Id,
                            GroupId = group.Id
                        };
                        await db.InsertAsync(userGroup);
                        return Result<AppUser>.Succeeded(user);
                    }).Aggregate();
                }))
                .Map(_ => this as DbModel);
        }
    }
}