using Infrastructure;

namespace WebApi
{
    public class Vote : DbModel
    {
        public string PropositionId { get; set; }
        public bool _Vote { get; set; }
    }
}