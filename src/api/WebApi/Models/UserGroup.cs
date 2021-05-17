using System;
using ServiceStack.DataAnnotations;

namespace WebApi
{
    [Alias("user_group_bridge")]
    public class UserGroup
    {
        public Guid UserId { get; set; }
        public Guid GroupId { get; set; }
    }
}