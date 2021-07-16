using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Infrastructure;
using ServiceStack.OrmLite;

namespace WebApi
{
    public class GroupByIdQuery : AbstractQuery<GroupByIdQuery, Group>
    {
        public Guid UserId { get; set; }
        public string GroupId { get; set; }
    }

    public class GroupByIdQueryHandler : IQueryHandler<GroupByIdQuery, Group>
    {
        private readonly IDatabaseInterface _db;

        public GroupByIdQueryHandler(IDatabaseInterface db)
        {
            _db = db;
        }

        public async Task<Result<Group>> Handle(GroupByIdQuery query)
        {
            return (await _db.LoadSingleResultById<Group>(query.GroupId))
                .FailIf(group => !group.Users.Any(x => x.Id.Equals(query.UserId)),
                    $"User {query.UserId} is not in group");
        }

        public Task<Result<Group>> Handle(GroupByIdQuery request, CancellationToken cancellationToken)
        {
            return Handle(request);
        }
    }
}