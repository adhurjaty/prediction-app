using System.Linq;
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
            return (await _db.LoadSelect<AppUser>(x => x.Email == query.Email))
                .Map(x => x.FirstOrDefault());
        }

        public Task<Result<AppUser>> Handle(UserEagerQuery request, CancellationToken cancellationToken)
        {
            return Handle(request);
        }
    }
}