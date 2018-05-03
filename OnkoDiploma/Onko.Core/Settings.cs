using LinqToDB.Data;
using Microsoft.Extensions.Logging;
using Onko.Core.Data;

namespace Onko.Core
{
    public class Settings
    {
        public static Settings Instance;

        public DataSettings Data { get; set; } = new DataSettings();

        public DatabaseSettings Database { get; set; } = new DatabaseSettings();

        public EncryptSettings Encryption { get; set; } = new EncryptSettings();
    }

    public class DataSettings
    {
        public string DatabaseProvider { get; set; }

        public string ConnectionString { get; set; }
    }

    public class EncryptSettings
    {
        public string Key { get; set; }

        public int DerivationIterations { get; set; }

        public int KeySize { get; set; }
    }

    public class DatabaseSettings
    {
        public string ProviderName { get; set; } = "PostgreSQL.9.3";

        public string ConnectionString { get; set; }
        public static void SetupTrace(ILoggerFactory loggerFactory)
        {
            var logger = loggerFactory.CreateLogger<Database>();

            if (!logger.IsEnabled(LogLevel.Trace))
                return;

            DataConnection.TurnTraceSwitchOn();

            DataConnection.WriteTraceLine = (s, s1) => logger.LogTrace(s, s1);
        }
    }
}
