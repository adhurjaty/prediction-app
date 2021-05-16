using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Infrastructure
{
    public abstract class DbModel
    {
        [Column("id")]
        public Guid Id { get; set; }
    }
}