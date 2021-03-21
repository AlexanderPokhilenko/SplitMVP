using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Split.DAL.Models
{
    [Table("DialogMembers")]
    public class DialogMember
    {
        [Key]
        [Column("DialogMemberId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        [ForeignKey("DialogId")]
        public long DialogId { get; set; }

        [Required]
        [ForeignKey("DialogId")]
        public virtual Dialog Dialog { get; set; }

        [Required]
        [ForeignKey("AccountId")]
        public long AccountId { get; set; }

        [Required]
        [ForeignKey("AccountId")]
        public virtual Account Account { get; set; }
    }
}
