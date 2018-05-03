using Microsoft.AspNetCore.Mvc;
using Onko.Core.Contracts;
using Onko.Core.Impl;
using Onko.Core.Services;

namespace OnkoDiploma.Backend.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        public AuthController(Session session, AuthService service, EncryptManager encryptManager)
        {
            _session = session;
            _service = service;
            _encryptManager = encryptManager;
        }
        [Route("register")]
        [HttpPost]
        public Response<Doctor> Register([FromBody] LoginModel register)
        {
            var user = _service.RegisterNewUser(register.Login, register.Name, register.Password);

            return user;
        }

        [Route("login")]
        [HttpPost]
        public byte[] LogIn([FromBody] LoginModel loginModel)
        {
            return _service.LogIn(loginModel.Login, loginModel.Password, loginModel.ExpiresIn, name: loginModel.Name);
        }

        private readonly Session _session;
        
        private readonly AuthService _service;

        private readonly EncryptManager _encryptManager;

    }
}