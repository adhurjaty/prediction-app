using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;

namespace WebApi
{
    public interface IDbStrategyFactory
    {
        IDbStrategy<T> Get<T>();
    }

    public class DbStrategyFactory : IDbStrategyFactory
    {
        private readonly Dictionary<Type, object> _strategies;

        public DbStrategyFactory(IEnumerable<Type> assemblyTypes)
        {
            _strategies = assemblyTypes
                .Where(item => item.GetInterfaces()
                        .Where(i => i.IsGenericType)
                        .Any(i => i.GetGenericTypeDefinition() == typeof(IDbStrategy<>))
                    && !item.IsAbstract && !item.IsInterface)
                .Where(assignedType => assignedType.GetGenericArguments().Count() == 0)
                .ToDictionary(
                    assignedType => assignedType.GetInterfaces().First().GetGenericArguments().First(),
                    assignedType => Activator.CreateInstance(assignedType));
        }

        public IDbStrategy<T> Get<T>()
        {
            return (_strategies.GetValueOrDefault(typeof(T)) as IDbStrategy<T>)
                ?? GetDefaultStrategy<T>();
        }

        private IDbStrategy<T> GetDefaultStrategy<T>()
        {
            return new DefaultDbStrategy<T>();
        }
    }
}