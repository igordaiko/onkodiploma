using LinqToDB.Mapping;

namespace Onko.Core.Contracts
{
    [Table("Question")]
    public class Question
    {
        [Identity, PrimaryKey]
        public long Id { get; set; }

        [Column("Code")]
        public int Code { get; set; }

        [Column("Title")]
        public string Title { get; set; }

        [Column("QuestionnaireId")]
        public long QuestionnaireId { get; set; }
    }
}
