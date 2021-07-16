using System;
using System.Collections.Generic;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Infrastructure;
using ServiceStack.OrmLite;

namespace WebApi
{
    public class CreateGroupCommand : AbstractCommand<CreateGroupCommand>
    {
        public AppUser User { get; set; }
        public string Name { get; set; }

        // output properties
        public Guid GroupId { get; set; }
    }

    public class CreateGroupCommandHandler : ICommandHandler<CreateGroupCommand>
    {
        private readonly IDatabaseInterface _db;

        public CreateGroupCommandHandler(IDatabaseInterface db)
        {
            _db = db;
        }

        public async Task<Result> Handle(CreateGroupCommand command)
        {
            return (await _db.InsertResult(new Group()
                {
                    Name = command.Name,
                    Users = new List<AppUser>() { command.User }
                }))
                .Tee(group => command.GroupId = group.Id);
        }

        public Task<Result> Handle(CreateGroupCommand cmd, CancellationToken token)
        {
            return Handle(cmd);
        }
    }
}