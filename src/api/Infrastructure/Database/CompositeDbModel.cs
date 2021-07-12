using System.Data;
using System.Threading;
using System.Threading.Tasks;

namespace Infrastructure
{
    public abstract class CompositeDbModel : DbModel
    {
        public abstract Task LoadReferences(IDbConnection db, 
            CancellationToken token = default);
    }
}