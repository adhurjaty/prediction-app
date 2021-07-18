using System.Collections.Generic;
using System.Linq;

namespace Infrastructure
{
    public static class LinqExtensions
    {
        public static ListIntersection<T> IncludeExclude<T>(this IEnumerable<T> source,
            IEnumerable<T> other)
        {
            var intersection = new ListIntersection<T>();
            var otherDict = other.ToDictionary(x => x, x => true);
            foreach (var item in source)
            {
                if(otherDict.ContainsKey(item))
                {
                    otherDict[item] = false;
                    intersection.Included.Add(item);
                } 
                else
                {
                    intersection.LeftExcluded.Add(item);
                }
            }
            intersection.RightExcluded = otherDict
                .Where(x => x.Value)
                .Select(x => x.Key)
                .ToList();

            return intersection;
        }
    }

    public class ListIntersection<T>
    {
        public List<T> LeftExcluded { get; set; } = new List<T>();
        public List<T> RightExcluded { get; set; } = new List<T>();
        public List<T> Included { get; set; } = new List<T>();
    }
}