using System.Collections.Generic;
using Split.BLL.Models;
using Split.DAL;
using System.Linq;
using Split.DAL.Models;

namespace Split.BLL.Services
{
    public class AccountsService
    {
        private readonly ApplicationContext _context;

        public AccountsService(ApplicationContext context)
        {
            _context = context;
        }

        public AccountInfo CreateAccount(long multiAccountId, string username, string imageUrl)
        {
            var newAccount = new Account {MultiAccountId = multiAccountId, Username = username, ImageUrl = imageUrl};
            _context.Accounts.Add(newAccount);
            _context.SaveChanges();
            return new AccountInfo(newAccount.Id, newAccount.Username, newAccount.ImageUrl);
        }

        public long GetMultiAccountIdByAccountId(long accountId) => _context.Accounts.Find(accountId).MultiAccountId;

        public bool HasAccount(long multiAccountId, long accountId)
        {
            return _context.Accounts.Find(accountId).MultiAccountId == multiAccountId;
        }

        public AccountInfo[] GetByIds(IEnumerable<long> ids)
        {
            return _context.Accounts.Where(a => ids.Any(id => a.Id == id))
                .Select(a => new AccountInfo(a.Id,
                    a.Username,
                    a.ImageUrl))
                .ToArray();
        }

        public AccountInfo[] GetByMultiAccountId(long id)
        {
            return _context.Accounts.Where(a => a.MultiAccountId == id)
                .Select(a => new AccountInfo(a.Id,
                    a.Username,
                    a.ImageUrl))
                .ToArray();
        }

        public AccountInfo[] GetAllAccounts()//temporary
        {
            return _context.Accounts.Select(a => new AccountInfo(a.Id,
                a.Username,
                a.ImageUrl)).ToArray();
        }
    }
}
