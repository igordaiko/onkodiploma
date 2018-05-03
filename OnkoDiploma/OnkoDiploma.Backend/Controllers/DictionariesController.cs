using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc; 
using Microsoft.AspNetCore.Hosting;
using Onko.Core.Contracts;
using Onko.Core.Impl;
using Onko.Core.Interfaces;

namespace Onko.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class DictionariesController : Controller
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly ILocalizationManager localizationManager;
        private readonly QuestionsManager _questionsManager;
        private readonly PersonManager _personManager;


        public DictionariesController(IHostingEnvironment hostingEnvironment, ILocalizationManager localizationManager, QuestionsManager questionsManager, PersonManager personManager)
        {
            _hostingEnvironment = hostingEnvironment;
            this.localizationManager = localizationManager;
            _questionsManager = questionsManager;
            _personManager = personManager;
        }

        
        
        [Route("localization")]
        [HttpGet]
        public string Localization()
        {
            var filePath = _hostingEnvironment.ContentRootPath;
            return this.localizationManager.GetLocalizationJson(filePath);
        }

        [Route("questions")]
        [HttpGet]
        public string GetQuestions(byte lang = 1)
        {
            var questions = _questionsManager.GetQuestions(lang);

            return questions;
        }

        [Route("send")]
        [HttpPost]
        public ResultResponse SendResult([FromBody]ResultModel result)
        {
            var personId = _personManager.Save(new Person());
            var res = _questionsManager.SendResult(result, personId, result.Lang);
            return res;
        }

        [Route("setFileSaving")]
        [HttpPost]
        public void SetFileSaving([FromBody]SaveModel person)
        {
            if (person.PersonId.HasValue)
                _personManager.SetFileSaving(person.PersonId.Value);
        }
    }
}