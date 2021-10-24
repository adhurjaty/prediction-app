using FluentAssertions;
using Infrastructure;
using Xunit;

namespace WebApi.Test
{
    public class StrategyFactoryTests
    {
        [Fact]
        public void GetAppUserStrategy()
        {
            var factory = new DbStrategyFactory(typeof(Startup).Assembly.GetTypes());
            var strategy = factory.Get<AppUser>();

            strategy.Should().BeOfType(typeof(AppUserDbStrategy));
        }

        [Fact]
        public void GetDefaultStrategy()
        {
            var factory = new DbStrategyFactory(typeof(Startup).Assembly.GetTypes());
            var strategy = factory.Get<TestType>();

            strategy.Should().BeOfType(typeof(DefaultDbStrategy<TestType>));
        }

        private class TestType : DbModel { }
    }
}