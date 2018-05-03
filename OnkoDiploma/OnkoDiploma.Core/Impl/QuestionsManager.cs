using System.Linq;
using Newtonsoft.Json;

namespace OnkoDiploma.Core.Impl
{
    public class QuestionsManager
    {
        public QuestionsManager(Session session)
        {
            _session = session;
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

        private readonly Session _session;
    }
}
