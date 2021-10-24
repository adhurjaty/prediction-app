using Infrastructure;
using ServiceStack.Data;

namespace WebApi
{
    public class ModelsDatbaseInterface : DatabaseInterface, IDatabaseInterface
    {
        public ModelsDatbaseInterface(IDbConnectionFactory dbFactory) : base(dbFactory)
        {
            
        }
    }
}