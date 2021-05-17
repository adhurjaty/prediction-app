using Infrastructure;
using ServiceStack.DataAnnotations;

namespace WebApi
{
    [Alias("votes")]
    public class Vote : DbModel
    {
        public string PropositionId { get; set; }
        public bool _Vote { get; set; }
    }
}