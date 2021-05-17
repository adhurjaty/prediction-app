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
        private List<UserGroup> _userGroups = new List<UserGroup>();

        public BragDbFixture()
        {
            TruncateTables();
        }

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

        protected UserGroup DbUserGroup(UserGroup userGroup)
        {
            _db.Insert(userGroup);
            _userGroups.Add(userGroup);
            return userGroup;
        }

        private void InsertModel<T>(T model) where T : DbModel
        {
            if(model.Id == default)
                model.Id = Guid.NewGuid();
            _db.Insert(model);
        }

        protected void TruncateTables()
        {
            _db.DeleteAll<UserGroup>();
            _db.DeleteAll<Vote>();
            _db.DeleteAll<Proposition>();
            _db.DeleteAll<Group>();
            _db.DeleteAll<AppUser>();
        }

        public override void Dispose()
        {
            _db.DeleteAll(_users);
            _db.DeleteAll(_groups);
            _db.DeleteAll(_propositions);
            _db.DeleteAll(_votes);
            _db.DeleteAll(_userGroups);

            base.Dispose();
        }
    }
}