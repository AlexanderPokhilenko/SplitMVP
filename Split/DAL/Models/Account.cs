using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Split.DAL.Models
{
    [Table("Accounts")]
    public class Account
    {
        [Key]
        [Column("AccountId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string ImageUrl { get; set; }

        [Required]
        //[ForeignKey("MultiAccountId")]
        public long MultiAccountId { get; set; }

        [Required]
        //[ForeignKey("MultiAccountId")]
        public virtual MultiAccount MultiAccount { get; set; }

        public virtual IEnumerable<Message> Messages { get; set; }

        public virtual IEnumerable<DialogMember> Membership { get; set; }
    }
}
