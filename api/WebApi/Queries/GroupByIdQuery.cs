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
        public AppUser User { get; set; }
        public string GroupId { get; set; }
    }

    public class GroupByIdQueryHandler : IQueryHandler<GroupByIdQuery, Group>
    {
        private readonly IDatabaseInterface _db;
        private readonly IMediatorResult _mediator;

        public GroupByIdQueryHandler(IDatabaseInterface db, IMediatorResult mediator)
        {
            _db = db;
            _mediator = mediator;
        }

        public async Task<Result<Group>> Handle(GroupByIdQuery query)
        {
            return (await _db.LoadSingleById<Group>(query.GroupId))
                .FailIf(group => !group.Users.Any(y => y.Id.Equals(query.User.Id)),
                    $"User {query.User.Email} is not in group");
        }

        public Task<Result<Group>> Handle(GroupByIdQuery request, CancellationToken cancellationToken)
        {
            return Handle(request);
        }
    }
}