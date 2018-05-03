using System;
using System.Collections.Generic;
using System.Text;
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
                User = _session.Doctor
            };
        }

        private readonly Session _session;
    }
}
