using System;
using System.Collections.Generic;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Infrastructure;
using ServiceStack.DataAnnotations;
using ServiceStack.OrmLite;

namespace WebApi
{
    [Alias("bets")]
    public class Bet : DbModel
    {
        [References(typeof(Group))]
        public Guid GroupId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CloseTime { get; set; }
        public DateTime? ResolvedTime { get; set; }

        [Reference]
        public List<UserBetResult> UserBetResults { get; set; } = new List<UserBetResult>();

        [Ignore]
        public Group Group { get; set; }
    }
}