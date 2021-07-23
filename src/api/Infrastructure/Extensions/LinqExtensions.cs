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

        // code from MoreLinq https://github.com/morelinq/MoreLINQ/blob/master/MoreLinq/DistinctBy.cs
        public static IEnumerable<TSource> DistinctBy<TSource, TKey>(this IEnumerable<TSource> source,
            Func<TSource, TKey> keySelector)
        {
            return source.DistinctBy(keySelector, null);
        }

        public static IEnumerable<TSource> DistinctBy<TSource, TKey>(this IEnumerable<TSource> source,
            Func<TSource, TKey> keySelector, IEqualityComparer<TKey>? comparer)
        {
            if (source == null) throw new ArgumentNullException(nameof(source));
            if (keySelector == null) throw new ArgumentNullException(nameof(keySelector));

            return _(); IEnumerable<TSource> _()
            {
                var knownKeys = new HashSet<TKey>(comparer);
                foreach (var element in source)
                {
                    if (knownKeys.Add(keySelector(element)))
                        yield return element;
                }
            }
        }

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