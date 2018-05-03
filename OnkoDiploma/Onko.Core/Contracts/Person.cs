using System;
using LinqToDB.Mapping;

namespace Onko.Core.Contracts
{
    [Table("Person")]
    public class Person
    {
        [PrimaryKey, Identity]
        public long Id{ get; set; }

        [Column("Name")]
        public string Name { get; set; }

        [Column("Phone")]
        public string Phone { get; set; }

        [Column("Email")]
        public string Email { get; set; }

        [Column("City")]
        public string City { get; set; }

        [Column("Print")]
        public bool Print { get; set; }

        [Column]
        public DateTime? CreationTime { get; set; }
    }
}
