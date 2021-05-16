using System;
using System.Collections.Generic;
using Infrastructure;
using ServiceStack.OrmLite;

namespace WebApi.Test
{
    public abstract class BragDbFixture : DatabaseFixture
    {
        private List<AppUser> _users = new List<AppUser>();
        private List<Group> _groups = new List<Group>();
        private List<Proposition> _propositions = new List<Proposition>();
        private List<Vote> _votes = new List<Vote>();

        protected AppUser DbUser(AppUser user)
        {
            InsertModel(user);
            _users.Add(user);
            return user;
        }

        protected Group DbGroup(Group group)
        {
            InsertModel(group);
            _groups.Add(group);
            return group;
        }

        private void InsertModel<T>(T model) where T : DbModel
        {
            if(model.Id == default)
                model.Id = Guid.NewGuid();
            _db.Insert(model);
        }

        public override void Dispose()
        {
            _db.DeleteAll(_users);
            _db.DeleteAll(_groups);
            _db.DeleteAll(_propositions);
            _db.DeleteAll(_votes);

            base.Dispose();
        }
    }
}