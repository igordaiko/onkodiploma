using System;
using System.IO;
using Onko.Core.Interfaces;

namespace Onko.Core.Impl
{
    public class LocalizationManager : ILocalizationManager
    {
        public string GetLocalizationJson(string filePath)
        {
            var json = "";
            try
            {


                json = File.ReadAllText(filePath + @"/localization.json");
            }
            catch (Exception e)
            {
                File.WriteAllText(filePath + @"/logs.txt", e.Message);
            }
            return json;
        }
    }
}
