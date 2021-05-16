using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Infrastructure;
using ServiceStack.OrmLite;

namespace WebApi
{
    public class GroupsByUserQuery
    {
        public string UserId { get; set; }
    }

    public class GroupsByUserQueryHandler : IQueryHandler<GroupsByUserQuery, IEnumerable<GroupsByUserQuery>>
    {
        private readonly IDbConnection _db;

        public GroupsByUserQueryHandler(IDbConnection db)
        {
            _db = db;
        }

        public async Task<Result<IEnumerable<GroupsByUserQuery>>> Handle(
            GroupsByUserQuery query)
        {
            throw new NotImplementedException();
        }
    }
}