using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;

namespace WebApi
{
    public class DbStrategyFactory
    {
        private readonly Dictionary<Type, object> _strategies;
        
        public DbStrategyFactory()
        {
            var types = typeof(Startup).Assembly.GetTypes();
            _strategies = types
                .Where(item => item.GetInterfaces()
                        .Where(i => i.IsGenericType)
                        .Any(i => i.GetGenericTypeDefinition() == typeof(IDbStrategy<>))
                    && !item.IsAbstract && !item.IsInterface)
                .ToDictionary(assignedType => a)
                
        }

        public IDbStrategy Get<T>()
        {

        }
    }
}