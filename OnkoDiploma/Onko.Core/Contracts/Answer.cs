using System;
using System.Collections.Generic;
using System.Text;
using LinqToDB.Mapping;

namespace Onko.Core.Contracts
{
    [Table("Answer")]
    public class Answer
    {
        [PrimaryKey, Identity]
        public long Id { get; set; }

        [Column("PersonId")]
        public long PersonId { get; set; }

        [Column("Questionnaire")]
        public long Questionnaire { get; set; }

        [Column("Question")]
        public long Question { get; set; }

        [Column("Answer")]
        public int AnswerNum{ get; set; }

        [Column("CreationTime")]
        public DateTime? CreationTime{ get; set; }
    }
}
