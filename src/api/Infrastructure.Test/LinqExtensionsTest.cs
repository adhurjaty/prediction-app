using System.Collections.Generic;
using Xunit;
using FluentAssertions;

namespace Infrastructure.Test
{
    public class LinqExtensionsTest
    {
        [Fact]
        public void IncludeExcludeTest()
        {
            //Given
            var lst = new int[] { 2, 4, 6, 7, 8, 9};
            var other = new int[] {4, 6, 10, 8, 11};

            //When
            var result = lst.IncludeExclude(other);
            
            //Then
            result.Should().BeEquivalentTo(new ListIntersection<int>()
            {
                LeftExcluded = new List<int>() { 2, 7, 9 },
                RightExcluded = new List<int>() { 10, 11 },
                Included = new List<int>() { 4, 6, 8 }
            });
        }
    }
}