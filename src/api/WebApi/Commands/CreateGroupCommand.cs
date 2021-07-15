using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Infrastructure;
using ServiceStack.OrmLite;

namespace WebApi
{
    public class CreateGroupCommand : AbstractCommand<CreateGroupCommand>
    {
        public AppUser User { get; set; }
        public string Name { get; set; }
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
            return await _db.InsertResult(new Group()
                {
                    Name = command.Name,
                    Users = new List<AppUser>() { command.User }
                });
        }
    }
}