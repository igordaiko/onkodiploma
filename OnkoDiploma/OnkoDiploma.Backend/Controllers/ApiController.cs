using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Onko.Core.Contracts;
using Onko.Core.Impl;
using Onko.Core.Services;

namespace OnkoDiploma.Backend.Controllers
{
    [Route("api")]
    public class ApiController : Controller
    {
        public ApiController(Session session, ProfileService service)
        {
            _session = session;
            _service = service;
        }

        [Route("config")]
        public Config GetConfig()
        {
            return _service.GetConfig();
        }

        private readonly Session _session;

        private readonly ProfileService _service;
    }
}