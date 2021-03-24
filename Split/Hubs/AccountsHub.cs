using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Split.BLL.Models;
using Split.BLL.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Split.Hubs
{
    [Authorize]
    public class AccountsHub : Hub<AccountsHub.IClient>
    {
        private readonly AccountsService _accountsService;

        public AccountsHub(AccountsService accountsService)
        {
            _accountsService = accountsService;
        }

        public override Task OnConnectedAsync()
        {
            var id = long.Parse(Context.UserIdentifier);
            Clients.Caller.UserAccountsRequested(_accountsService.GetByMultiAccountId(id));
            Clients.Caller.OtherAccountsRequested(_accountsService.GetAllAccounts());//temporary
            Clients.Others.OtherAccountsRequested(_accountsService.GetByMultiAccountId(id));//temporary
            return base.OnConnectedAsync();
        }

        public Task RequestAccounts(IEnumerable<long> ids)
        {
            return Clients.Caller.OtherAccountsRequested(_accountsService.GetByIds(ids));
        }

        public async Task CreateAccount(string username, string imageUrl)
        {
            var id = long.Parse(Context.UserIdentifier);
            var accInfo = _accountsService.CreateAccount(id, username, imageUrl);
            await Clients.Others.OtherAccountsRequested(new []{accInfo});//temporary
            await Clients.User(Context.UserIdentifier).AccountCreated(accInfo);
        }

        public interface IClient
        {
            Task AccountCreated(AccountInfo account);
            Task UserAccountsRequested(IEnumerable<AccountInfo> accounts);
            Task OtherAccountsRequested(IEnumerable<AccountInfo> accounts);
        }
    }
}
