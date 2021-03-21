using Split.BLL.Models;
using Split.DAL;
using System.Linq;

namespace Split.BLL.Services
{
    public class AccountsService
    {
        private readonly ApplicationContext _context;

        public AccountsService(ApplicationContext context)
        {
            _context = context;
        }

        public AccountInfo[] GetByMultiAccountId(long id)
        {
            return _context.Accounts.Where(a => a.MultiAccountId == id)
                .Select(a => new AccountInfo(a.Id,
                    a.Username,
                    a.ImageUrl))
                .ToArray();
        }
    }
}
