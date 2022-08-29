using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Infrastructure;

namespace WebApi
{
    public class SearchEmailsQuery : AbstractQuery<SearchEmailsQuery, string[]>
    {
        public string Search { get; init; }
        public int Limit { get; init; }
    }

    public class SearchEmailsQueryHandler : IQueryHandler<SearchEmailsQuery, string[]>
    {
        private readonly IDatabaseInterface _db;

        public SearchEmailsQueryHandler(IDatabaseInterface db)
        {
            _db = db;
        }

        public async Task<Result<string[]>> Handle(SearchEmailsQuery query)
        {
            return (await _db.Select<AppUser>(u =>
                    u.Email.ToLower().Contains(query.Search.ToLower())))
                .Map(users => users
                    .Select(u => u.Email)
                    .OrderBy(email => email.ToLower().IndexOf(query.Search.ToLower()))
                    .Take(query.Limit)
                    .ToArray());

        }

        public Task<Result<string[]>> Handle(SearchEmailsQuery request, CancellationToken cancellationToken)
        {
            return Handle(request);
        }
    }
}