using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Infrastructure;

namespace WebApi
{
    public class BetDbStrategy : DefaultModelDbStrategy<Bet>
    {
        public override async Task<Result<int>> Delete(IDatabaseInterface db, Bet model, 
            CancellationToken token = default)
        {
            return await (await ApplyToBetResults(model, ug => db.Delete(ug, token: token)))
                .Bind(users => db.Delete(model, token));
        }

        public override async Task<Result<long>> Insert(IDatabaseInterface db, 
            Bet model, CancellationToken token = default)
        {
            return (await (await base.Insert(db, model, token))
                .TupleBind(_ => 
                {
                    return ApplyToBetResults(model, ug => 
                    {
                        ug.BetId = model.Id;
                        return db.Insert(ug, token: token);
                    });
                }))
                .Map((id, _) => id);
        }

        public override async Task<Result> LoadReferences(IDatabaseInterface db, 
            Bet model, CancellationToken token = default)
        {
            return (await db.LoadReferences(model, token: token))
                .Merge(await model.UserBetResults.Select(ug => 
                    db.LoadReferences(ug, token: token)).Aggregate());
        }

        public override async Task<Result<int>> Update(IDatabaseInterface db, 
            Bet model, CancellationToken token = default)
        {
            return (await (await (await db.LoadSingleById<Bet>(model.Id))
                .Bind(async dbGroup =>
                {
                    var listIntersection = model.UserBetResults
                        .IncludeExclude(dbGroup.UserBetResults);
                    var toDelete = listIntersection.RightExcluded;
                    var toInsert = listIntersection.LeftExcluded;

                    var deleteTask = Task.WhenAll(toDelete.Select(x => db.Delete(x, token)));
                    var insertTask = toInsert.Select(x => db.InsertResult(x, token))
                        .Aggregate();
                    await deleteTask;
                    return await insertTask;
                }))
                .Bind(dbGroup => db.Update(model, token)));
        }

        private async Task<Result<UserBetResult[]>> ApplyToBetResults(Bet bet,
            Func<UserBetResult, Task> fn)
        {
            return await bet.UserBetResults.Select(async userBetResult =>
            {
                await fn(userBetResult);
                return Result<UserBetResult>.Succeeded(userBetResult);
            }).Aggregate();
        }
    }
}