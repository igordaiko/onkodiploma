using LinqToDB.Mapping;

namespace OnkoDiploma.Core.Contracts
{
    [Table]
    public class Question
    {
        [Identity, PrimaryKey]
        public long Id { get; set; }

        [Column]
        public int Code { get; set; }

        [Column]
        public string Title { get; set; }

        [Column]
        public long QuestionnaireId { get; set; }
    }
}
