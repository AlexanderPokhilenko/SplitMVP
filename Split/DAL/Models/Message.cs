using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Split.DAL.Models
{
    [Table("Messages")]
    public class Message
    {
        [Key]
        [Column("MessageId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        public string Text { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        [ForeignKey("DialogId")]
        public long DialogId { get; set; }

        [Required]
        [ForeignKey("DialogId")]
        public virtual Dialog Dialog { get; set; }

        [Required]
        [ForeignKey("AccountId")]
        public long AuthorId { get; set; }

        [Required]
        [ForeignKey("AccountId")]
        public virtual Account Author { get; set; }
    }
}
