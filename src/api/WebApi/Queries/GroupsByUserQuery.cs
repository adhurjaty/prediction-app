using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Infrastructure;
using ServiceStack.OrmLite;

namespace WebApi
{
    public class GroupsByUserQuery : AbstractQuery<GroupsByUserQuery, List<Group>>
    {
        public string UserId { get; set; }
    }

    public class GroupsByUserQueryHandler : IQueryHandler<GroupsByUserQuery, List<Group>>
    {
        private readonly IDbConnection _db;

        public GroupsByUserQueryHandler(IDbConnection db)
        {
            _db = db;
        }

        public async Task<Result<List<Group>>> Handle(
            GroupsByUserQuery query)
        {
            var sqlQuery = _db.From<Group>()
                .Join<AppUser, UserGroup>((user, userGroup) => user.Id == userGroup.UserId)
                .Where<AppUser>(user => user.Id.ToString() == query.UserId);
            
            return await _db.SelectResult(sqlQuery);
        }
    }
}