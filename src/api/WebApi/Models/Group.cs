using Infrastructure;
using ServiceStack.DataAnnotations;

namespace WebApi
{
    [Alias("groups")]
    public class Group : DbModel
    {
        public string Name { get; set; }
    }
}