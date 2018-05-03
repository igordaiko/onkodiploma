using System;
using System.Collections.Generic;
using System.Text;
using Onko.Core.Contracts;

namespace Onko.Core.Impl
{
    public struct Priviledge
    {
        public bool Any { get; set; }

        public bool Own { get; set; }
    }

    internal class Privileges
    {
        public static readonly Privileges Empty = new Privileges();

        private Privileges()
        {
        }

        public bool ManageNotOwn { get; private set; }

        public bool ViewNotOwn { get; private set; }

        public bool ViewClients { get; private set; }

        public bool ManageClients { get; private set; }

        public bool GetProfile { get; internal set; }

        public bool UpdateProfile { get; set; }

        public bool ManageDoctors { get; set; }



        public static Privileges Create(long roles)
        {
            var result = new Privileges();

            foreach (var pair in _rolesMapping)
                if ((roles & (int)pair.Key) != 0)
                    pair.Value(result);

            return result;
        }

        private static readonly Dictionary<Role, Action<Privileges>> _rolesMapping = new Dictionary<Role, Action<Privileges>>
        {
            {
                Role.Administrator, p =>
                {
                    p.ManageNotOwn = true;
                    p.ViewNotOwn = true;
                    p.ViewClients = true;
                    p.GetProfile = true;
                    p.UpdateProfile = true;
                    p.ManageClients = true;
                    p.ManageDoctors = true;

                }
            },
            {
                Role.Moderator, p =>
                {
                    p.ViewNotOwn = true;
                    p.ViewClients = true;
                    p.GetProfile = true;
                    p.UpdateProfile = true;
                    p.ManageClients = true;
                    p.ManageDoctors = true;

                }
            },

            {
                Role.Doctor, p =>
                {
                    p.ViewClients = true;
                    p.GetProfile = true;
                    p.UpdateProfile = true;
                    p.ManageClients = true;

                }
            }
        };
    }
}
