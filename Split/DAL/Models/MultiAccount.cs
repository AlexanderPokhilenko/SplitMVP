using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Split.DAL.Models
{
    [Table("MultiAccounts")]
    public class MultiAccount : IdentityUser<long>
    {
        public virtual IEnumerable<Account> Accounts { get; set; }
    }
}
