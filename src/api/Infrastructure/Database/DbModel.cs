using System.ComponentModel.DataAnnotations.Schema;

namespace Infrastructure
{
    public abstract class DbModel
    {
        [Column("id")]
        public string Id { get; set; }
    }
}