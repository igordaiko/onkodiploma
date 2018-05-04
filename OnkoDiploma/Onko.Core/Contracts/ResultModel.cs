using System;
using System.Collections.Generic;
using System.Text;

namespace Onko.Core.Contracts
{
    public class ResultModel
    {
        public AnswerModel[] Answers { get; set; }
        public Person Person { get; set; }
        public byte Lang { get; set; }
    }

    public class AnswerModel
    {
        public long Question { get; set; }
        public long Person { get; set; }
        public long Questionnaire { get; set; }
        public byte Answer { get; set; }
    }

    public class SaveModel
    {
        public string PersonId { get; set; }
    }

    public class ResultResponse
    {
        public string Result { get; set; }
        public int RecomId { get; set; }
        public List<string> TrueAnswers { get; set; }
        public string PersonId { get; set; }
    }

}
