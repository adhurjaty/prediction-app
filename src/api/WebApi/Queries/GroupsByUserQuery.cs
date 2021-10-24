using System;
using System.Collections.Generic;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Infrastructure;
using ServiceStack.OrmLite;

namespace WebApi
{
    public class GroupsByUserQuery : AbstractQuery<GroupsByUserQuery, List<Group>>
    {
        public string Email { get; set; }
    }

    public class GroupsByUserQueryHandler : IQueryHandler<GroupsByUserQuery, List<Group>>
    {
        private readonly IDatabaseInterface _db;

        public GroupsByUserQueryHandler(IDatabaseInterface db)
        {
            _db = db;
        }

        public async Task<Result<List<Group>>> Handle(
            GroupsByUserQuery query)
        {
            var sqlQuery = _db.From<Group>()
                .Join<Group, UserGroup>((group, userGroup) => group.Id == userGroup.GroupId)
                .Join<UserGroup, AppUser>((userGroup, user) => userGroup.UserId == user.Id)
                .Where<AppUser>(user => user.Email == query.Email);
            
            return await _db.Select(sqlQuery);
        }

        public Task<Result<List<Group>>> Handle(GroupsByUserQuery request, CancellationToken cancellationToken)
        {
            return Handle(request);
        }
    }
}