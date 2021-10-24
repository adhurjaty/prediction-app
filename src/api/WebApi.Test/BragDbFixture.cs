using System;
using System.Collections.Generic;
using System.Linq;
using Infrastructure;
using MediatR;
using Moq;
using ObjectsComparer;
using ServiceStack.OrmLite;

namespace WebApi.Test
{
    public abstract class BragDbFixture : DatabaseFixture
    {
        protected readonly Mock<IMediatorResult> _mediatorMock = 
            new Mock<IMediatorResult>();

        public BragDbFixture() : base()
        {
            var strategyFactory = new DbStrategyFactory(typeof(Startup).Assembly.GetTypes());
            _db = new ModelsDatbaseInterface(_db, strategyFactory);
        }

        protected AppUser DbUser(AppUser user)
        {
            _db.Insert(user).Wait();
            return user;
        }

        protected Group DbGroup(Group group)
        {
            _db.Insert(group).Wait();
            return group;
        }

        protected UserGroup DbUserGroup(UserGroup userGroup)
        {
            _db.Insert(userGroup);
            return userGroup;
        }

        private void InsertModel<T>(T model) where T : DbModel
        {
            if(model.Id == default)
                model.Id = Guid.NewGuid();

            _db.Insert(model);
        }

        public BragDbFixture WithMediatorResult<TReq, TResp>(Result<TResp> result)
            where TReq : AbstractQuery<TReq,TResp>
        {
            _mediatorMock.Setup(x => x.Send(It.IsAny<TReq>(), default)).ReturnsAsync(result);
            return this;
        }
        
        public BragDbFixture WithMediatorResult<TCmd>(Result result)
            where TCmd : AbstractCommand<TCmd>
        {
            _mediatorMock.Setup(x => x.Send(It.IsAny<TCmd>(), default)).ReturnsAsync(result);
            return this;
        }

        public void VerifyMediator<TReq, TResp>(TReq request)
            where TReq : AbstractQuery<TReq,TResp>
        {
            _mediatorMock.Verify(x => x.Send(It.Is<TReq>(y =>
                EquivalentObjects(request, y)), default), Times.Once());
        }
        
        public void VerifyMediator<TCmd>(TCmd request)
            where TCmd : AbstractCommand<TCmd>
        {
            _mediatorMock.Verify(x => x.Send(It.Is<TCmd>(y =>
                EquivalentObjects(request, y)), default), Times.Once());
        }

        protected static bool EquivalentObjects<T>(T a, T b)
        {
            var areEqual = new ObjectsComparer.Comparer<T>().Compare(a, b,
                out IEnumerable<Difference> differences);
            if(!areEqual)
                Console.WriteLine("objects not equal");
            return areEqual;
        }

        public override void Dispose()
        {
            _db.DeleteAll<Vote>();
            _db.DeleteAll<Bet>();
            _db.DeleteAll<UserGroup>();
            _db.DeleteAll<FriendsRelation>();
            _db.DeleteAll<Group>();
            _db.DeleteAll<AppUser>();

            base.Dispose();
        }
    }
}