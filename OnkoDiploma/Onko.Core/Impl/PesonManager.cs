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
        public PersonManager(Session session, EncryptManager encryptManager)
        {
            _session = session;
            _encryptManager = encryptManager;
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

        public void SetFileSaving(string personIdHash)
        {
            using (var work = _session.BeginWork())
            {
                var personId = Convert.ToInt64(_encryptManager.Decrypt(personIdHash));
                var db = work.Database;

                var person = db.Persons.First(x => x.Id == personId);

                person.Print = true;

                db.Update(person);

                work.Commit();
            }
        }

        private readonly Session _session;
        private readonly EncryptManager _encryptManager;
    }
}
