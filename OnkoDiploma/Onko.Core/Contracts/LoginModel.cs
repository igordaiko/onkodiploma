using System;
using System.Collections.Generic;
using System.Text;

namespace Onko.Core.Contracts
{
    public class LoginModel
    {
        public string Login { get; set; }

        public string Password { get; set; }

        public long ExpiresIn { get; set; }

        public string Name { get; set; }

        //public bool IsLocalUser { get; set; }

        //public bool Merge { get; set; }
    }
}
