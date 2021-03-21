using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Split.DAL.Models
{
    [Table("Dialogs")]
    public class Dialog
    {
        [Key]
        [Column("DialogId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        public string Name { get; set; }

        public string ImageUrl { get; set; }

        public virtual IEnumerable<Message> Messages { get; set; }

        public virtual IEnumerable<DialogMember> Membership { get; set; }
    }
}
