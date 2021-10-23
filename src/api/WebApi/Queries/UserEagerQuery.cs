using System.Threading;
using System.Threading.Tasks;
using Infrastructure;

namespace WebApi
{
    public class UserEagerQuery : AbstractQuery<UserEagerQuery, AppUser>
    {
        public string Email { get; init; }
    }

    public class UserEagerQueryHandler : IQueryHandler<UserEagerQuery, AppUser>
    {
        private readonly IDatabaseInterface _db;

        public UserEagerQueryHandler(IDatabaseInterface db)
        {
            _db = db;
        }

        public async Task<Result<AppUser>> Handle(UserEagerQuery query)
        {
            return (await (await _db.SingleResult<AppUser>(x => x.Email == query.Email))
                .Tee(user => _db.LoadReferences(user)));
                // .;
        }

        public Task<Result<AppUser>> Handle(UserEagerQuery request, CancellationToken cancellationToken)
        {
            return Handle(request);
        }
    }
}