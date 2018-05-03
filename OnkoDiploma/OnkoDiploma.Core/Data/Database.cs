using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using LinqToDB;
using OnkoDiploma.Core.Contracts;

namespace OnkoDiploma.Core.Data
{
    public class Database : Luxena.Data.DataConnection
    {
        internal static Database Open()
        {
            var conf = Settings.Instance.Data;

            var db = new Database(conf.DatabaseProvider, conf.ConnectionString);

            db.BeginTransaction();

            return db;
        }

        private Database(string providerName, string connectionString) : base(providerName, connectionString)
        {
        }
        public ITable<Question> Questions => GetTable<Question>();
    }


    internal static class Extensions
    {
        [Sql.Expression(" 0 for update", ServerSideOnly = true)]
        public static int ForUpdate()
        {
            throw new InvalidOperationException();
        }

        public static IQueryable<T> ForUpdate<T>(this IQueryable<T> queryable)
        {
            return queryable.Where(t => 0 == ForUpdate());
        }
    }
}
