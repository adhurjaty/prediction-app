using System;
using System.Data;
using ServiceStack.OrmLite;

namespace Infrastructure
{
    public abstract class DatabaseFixture : IDisposable
    {
        protected IDbConnection _db;

        public DatabaseFixture()
        {
            var factory = new OrmLiteConnectionFactory(
                "Host=localhost;Username=postgres;Password=igotbraggingrights;Port=5432;Database=braggingrights_test",
                PostgreSqlDialect.Provider);
            _db = factory.CreateDbConnection();
            _db.Open();
        }

        public void Dispose()
        {
            _db.Close();
        }
    }
}