using Infrastructure;
using ServiceStack.DataAnnotations;

namespace WebApi
{
    [Alias("propositions")]
    public class Proposition : DbModel
    {
        public string GroupId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public bool? Result { get; set; }
    }
}