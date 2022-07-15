using System;
using Xunit;
using FluentAssertions;
using Infrastructure;

namespace Infrastructure.Test
{
    public class ResultTests
    {
        [Fact]
        public void BindSuccessTwoType()
        {
            var result = Result<string, Exception>.Succeeded("foo");
            
            result.Success.Should().Be("foo");
            var res2 = result
                .Bind(s => Result<int, Exception>.Succeeded(7));
            res2.Success.Should().Be(7);
        }

        [Fact]
        public void BindSuccessOneType()
        {
            var result = Result.Succeeded("foo")
                .Bind(s => Result.Succeeded($"{s} bar"));
            
            result.Success.Should().Be("foo bar");
        }
    }
}
