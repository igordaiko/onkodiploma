using System;
using System.Data;
using System.Linq;
using System.Xml.Linq;
using LinqToDB;
using LinqToDB.Data;
using Newtonsoft.Json;
using Onko.Core.Contracts;

namespace Onko.Core.Impl
{
    public class QuestionsManager
    {
        public QuestionsManager(Session session, EncryptManager encryptManager)
        {
            _session = session;
            _encryptManager = encryptManager;
        }
        public string GetQuestions(byte lang = 1)
        {
            using (var work = _session.BeginWork())
            {
                var db = work.Database;
                var questions = db.Questions.ToList();
                return JsonConvert.SerializeObject(questions);
            }
        }
        public ResultResponse SendResult(ResultModel model, long personId, byte lang)
        {
            using (var work = _session.BeginWork())
            {
                var db = work.Database;
                Answer[] answers = new Answer[model.Answers.Length];
                Answer answer = new Answer();
                var creationTime = DateTime.Now;
                int i = 0;
                decimal? questionnare = db.Questionnaires.ToList().Find(x => x.Id == model.Answers[0].Questionnaire)?.Id;
                model.Answers.ToList().ForEach(x =>
                {
                    answer = new Answer
                    {
                        AnswerNum = x.Answer,
                        PersonId = personId,
                        CreationTime = creationTime,
                        Question = x.Question,
                        Questionnaire = 1
                    };
                    db.Insert(answer);
                    answers[i++] = answer;
                });
                work.Commit();

                string sResult = null;
                long? sRecom = null;
                var param1 = new DataParameter("vperson_id", personId, DataType.Int32);
                var param2 = new DataParameter("vquestionnaire", questionnare ?? 1, DataType.Int32);
                var param3 = new DataParameter("vlang", 1, DataType.Int32);
                var param4 =
                    new DataParameter("sresult", sResult, DataType.VarChar) {Direction = ParameterDirection.Output};
                var param5 = new DataParameter("srecom", sRecom, DataType.Int32) { Direction = ParameterDirection.Output };
                db.ExecuteProc("processing_results", param1, param2, param3, param4, param5);
                //context.PROCESSING_RESULTS(personId, questionnare, (decimal)lang, param3, param4);
                var result = param4.Value != null ? param4.Value.ToString() : "Empty result";
                var response = new ResultResponse()
                {
                    Result = result,
                    RecomId = Convert.ToInt32(param5.Value),
                    TrueAnswers = answers.Where(x=>x.AnswerNum == 1).Select(x=>db.Questions.First(q=>q.Id == x.Question).Title).ToList(),
                    PersonId = _encryptManager.Encrypt(personId.ToString())
                };
                return response;
            }
        }
        private readonly Session _session;
        private readonly EncryptManager _encryptManager;
    }
}
