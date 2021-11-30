using System;
using System.Collections.Generic;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Infrastructure;
using ServiceStack.OrmLite;

namespace WebApi
{
    public class CreateUserCommand : AbstractCommand<CreateUserCommand>
    {
        public string Email { get; set; }
        public string DisplayName { get; set; }

        // output properties
        public Guid UserId { get; set; }
    }

    public class CreateUserCommandHandler : ICommandHandler<CreateUserCommand>
    {
        private readonly IDatabaseInterface _db;
        private readonly IMediatorResult _mediator;

        public CreateUserCommandHandler(IDatabaseInterface db, IMediatorResult mediator)
        {
            _db = db;
            _mediator = mediator;
        }

        public async Task<Result> Handle(CreateUserCommand command)
        {
            return (await _db.InsertResult(new AppUser()
                {
                    DisplayName = command.DisplayName,
                    Email = command.Email
                }))
                .Tee(user => command.UserId = user.Id);
        }

        public Task<Result> Handle(CreateUserCommand cmd, CancellationToken token)
        {
            return Handle(cmd);
        }
    }
}