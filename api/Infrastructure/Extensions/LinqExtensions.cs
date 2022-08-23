using System;
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

        /// <summary>
        /// Returns a list of lists of decreasing length, removing the first element in 
        /// each subsequent list. E.g. [1, 2, 3, 4] -> [[1, 2, 3, 4], [2, 3, 4], [3, 4]]
        /// </summary>
        public static IEnumerable<IEnumerable<T>> Clique<T>(this IEnumerable<T> source)
        {
            for (int i = 0; i < source.Count() - 1; i++)
            {
                yield return source.Skip(i);
            }
        }
    }

    public class ListIntersection<T>
    {
        public List<T> LeftExcluded { get; set; } = new List<T>();
        public List<T> RightExcluded { get; set; } = new List<T>();
        public List<T> Included { get; set; } = new List<T>();
    }
}