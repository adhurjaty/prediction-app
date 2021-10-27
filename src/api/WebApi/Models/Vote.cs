using System;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Infrastructure;
using ServiceStack.DataAnnotations;
using ServiceStack.OrmLite;

namespace WebApi
{
    [Alias("votes")]
    public class Vote : DbModel
    {
        public string PropositionId { get; set; }
        public bool _Vote { get; set; }
    }
}