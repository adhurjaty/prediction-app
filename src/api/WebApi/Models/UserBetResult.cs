using System;
using ServiceStack.DataAnnotations;

namespace WebApi
{
    [Alias("user_bet_results")]
    public class UserBetResult
    {
        private Guid _userId;
        [References(typeof(AppUser))]
        public Guid UserId 
        { 
            get { return User?.Id ?? _userId; }
            set
            {
                if(User != null)
                    User.Id = value;
                _userId = value;
            }
        }

        [Reference]
        public AppUser User { get; set; }

        [References(typeof(Bet))]
        public Guid BetId { get; set; }
        public bool HasWon { get; set; }
    }
}