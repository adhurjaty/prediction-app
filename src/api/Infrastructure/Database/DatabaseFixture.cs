using System;
using System.Data;
using ServiceStack.OrmLite;

namespace Infrastructure
{
    public abstract class DatabaseFixture : IDisposable
    {
        protected IDatabaseInterface _db;

        public DatabaseFixture()
        {
            var factory = new OrmLiteConnectionFactory(
                "Host=localhost;Username=postgres;Password=igotbraggingrights;Port=5432;Database=braggingrights_test",
                PostgreSqlDialect.Provider);
            _db = new DatabaseInterface(factory);
        }

        public virtual void Dispose()
        {
        }
    }
}