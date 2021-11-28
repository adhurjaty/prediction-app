using System;
using ServiceStack.DataAnnotations;

namespace WebApi
{
    [Alias("user_bet_results")]
    public class UserBetResult
    {
        [References(typeof(AppUser))]
        public Guid UserId { get; set; }
        [References(typeof(Bet))]
        public Guid BetId { get; set; }
        public bool HasWon { get; set; }
    }
}