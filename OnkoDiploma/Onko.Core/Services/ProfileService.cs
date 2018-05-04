using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using LinqToDB;
using Onko.Core.Contracts;
using Onko.Core.Impl;

namespace Onko.Core.Services
{
    public class ProfileService
    {
        public ProfileService(Session session)
        {
            _session = session;
        }

        public Config GetConfig()
        {
            return new Config()
            {
                User = _session.Doctor,
                Stats = GetStats()
            };
        }

        public List<Stats> GetStats()
        {
            using (var work = _session.BeginWork())
            {
                var db = work.Database;
                return db.Stats.ToList();
            }
        }

        private readonly Session _session;
    }
}
