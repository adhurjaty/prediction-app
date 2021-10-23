using System.Threading;
using System.Threading.Tasks;
using Infrastructure;

namespace WebApi
{
    public class UserQuery : AbstractQuery<UserQuery, AppUser>
    {
        public string Email { get; set; }
    }

    public class UserQueryHandler : IQueryHandler<UserQuery, AppUser>
    {
        private readonly IDatabaseInterface _db;

        public UserQueryHandler(IDatabaseInterface db)
        {
            _db = db;
        }

        public async Task<Result<AppUser>> Handle(UserQuery query)
        {
            return await _db.SingleResult<AppUser>(x => x.Email == query.Email);
        }

        public Task<Result<AppUser>> Handle(UserQuery request, CancellationToken cancellationToken)
        {
            return Handle(request);
        }
    }
}