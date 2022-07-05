using System;
using System.Collections.Generic;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Infrastructure;
using ServiceStack.OrmLite;
using WebApi;

namespace WebApi
{
    public class CreateUserCommand : AbstractCommand<CreateUserCommand>
    {
        public string Email { get; set; }
        public string DisplayName { get; set; }
        public string FlowAddress { get; set; }

        // output properties
        public Guid UserId { get; set; }
    }

    public class CreateUserCommandHandler : ICommandHandler<CreateUserCommand>
    {
        private readonly IDatabaseInterface _db;

        public CreateUserCommandHandler(IDatabaseInterface db)
        {
            _db = db;
        }

        public async Task<Result> Handle(CreateUserCommand command)
        {
            return await _db.InsertResult(new AppUser()
                {
                    Email = command.Email,
                    DisplayName = command.DisplayName
                });
        }

        public Task<Result> Handle(CreateUserCommand cmd, CancellationToken token)
        {
            return Handle(cmd);
        }
    }
}