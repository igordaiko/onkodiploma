using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using LinqToDB;
using Onko.Core.Contracts;
using Onko.Core.Impl;
using Onko.Core.Interfaces;

namespace Onko.Core.Services
{
    public class AuthService
    {
        public AuthService(Session session, IClientEvents clientEvents)
        {
            _session = session;
            _clientEvents = clientEvents;
        }

        //Register local doctor
        public Response<Doctor> RegisterNewUser(string login, string name, string password, bool isfacebookuser = false)
        {
            using (var work = _session.BeginWork())
            {
                var db = work.Database;

                var user = new Doctor
                {
                    Login = login,
                    Name = name,
                    Roles = (int)Role.Doctor,
                };

                user.SetPassword(password);
                user.Id = Convert.ToInt64(db.InsertWithIdentity(user));

                work.Commit();

                return new Response<Doctor>
                {
                    Result = new Doctor
                    {
                        Id = user.Id,
                        Login = user.Login,
                        Name = user.Name,
                        Roles = user.Roles
                    }
                };
            }
        }
        //Local user login
        public byte[] LogIn(string login, string password, long expiresIn, string name = "")
        {
            return _session.LogIn(login, password) ? _session.GetAccessToken(expiresIn) : null;
        }

        public void RemoveUser(string login)
        {
            using (var work = _session.BeginWork())
            {
                var db = work.Database;
                var user = db.Doctors.SingleOrDefault(u => u.Login == login);

                db.Delete(user);
                work.Commit();
            }
        }
        private readonly Session _session;
        private readonly IClientEvents _clientEvents;
    }

}
