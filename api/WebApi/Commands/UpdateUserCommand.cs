using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Infrastructure;

namespace WebApi
{
    public class UpdateUserCommand : AbstractCommand<UpdateUserCommand>
    {
        public AppUser User { get; init; }
    }

    public class UpdateUserCommandHandler : ICommandHandler<UpdateUserCommand>
    {
        private readonly IDatabaseInterface _db;
        private readonly IMediatorResult _mediator;

        public UpdateUserCommandHandler(IDatabaseInterface db, IMediatorResult mediator)
        {
            _db = db;
            _mediator = mediator;
        }

        public async Task<Result> Handle(UpdateUserCommand cmd)
        {
            if(cmd.User.Email.Length == 0)
                return Result.Failed("Cannot update user with no email");

            return await (await _mediator.Send(new UserQuery()
                {
                    Email = cmd.User.Email
                }))
                .FailIf(user => 
                    user.Email?.Length == 0,
                    $"User {cmd.User.Email} does not exist")
                .Bind(() => _db.Update(cmd.User));
        }

        public Task<Result> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {
            return Handle(request);
        }
    }
}