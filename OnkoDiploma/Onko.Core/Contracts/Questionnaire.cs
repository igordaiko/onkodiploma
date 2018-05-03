using System;
using System.Collections.Generic;
using System.Text;
using LinqToDB.Mapping;

namespace Onko.Core.Contracts
{
    [Table("Questionaire")]
    public class Questionnaire
    {
        [Identity, PrimaryKey]
        public long Id { get; set; }

        [Column("Title")]
        public string Title { get; set; }

        [Column("Comment")]
        public long Comment { get; set; }
    }
}
