using System;
using System.Collections.Generic;
using Infrastructure;
using ServiceStack.OrmLite;

namespace WebApi.Test
{
    public abstract class BragDbFixture : DatabaseFixture
    {
        private List<AppUser> _users = new List<AppUser>();

        protected AppUser DbUser(AppUser user)
        {
            if(user.Id == default)
                user.Id = Guid.NewGuid();
            _db.Insert(user);
            _users.Add(user);
            return user;
        }

        public override void Dispose()
        {
            _db.DeleteAll(_users);

            base.Dispose();
        }
    }
}