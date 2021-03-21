using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Split.DAL.Models
{
    [Table("Roles")]
    public class AppRole : IdentityRole<long>
    {
    }
}
