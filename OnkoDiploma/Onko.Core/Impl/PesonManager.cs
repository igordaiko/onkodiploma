using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using LinqToDB;
using Onko.Core.Contracts;

namespace Onko.Core.Impl
{
    public class PersonManager
    {
        public PersonManager(Session session)
        {
            _session = session;
        }

        public long Save(Person person)
        {
            using (var work = _session.BeginWork())
            {
                var db = work.Database;
                person.CreationTime = DateTime.Now;
                var id = (long)db.InsertWithIdentity(person);

                work.Commit();

                return id;

            }
        }

        public void SetFileSaving(decimal personId)
        {
            using (var work = _session.BeginWork())
            {
                var db = work.Database;

                var person = db.Persons.First(x => x.Id == personId);

                person.Print = true;

                db.Update(person);

                work.Commit();
            }
        }

        private readonly Session _session;
    }
}
