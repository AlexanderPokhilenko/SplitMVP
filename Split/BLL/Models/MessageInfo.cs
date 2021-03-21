using System;

namespace Split.BLL.Models
{
    [Serializable]
    public class MessageInfo
    {
        public long Id { get; set; }

        public string Text { get; set; }

        public DateTime Date { get; set; }

        public long AuthorId { get; set; }

        public MessageInfo() : this(0, "Empty message", DateTime.Now, 0)
        { }

        public MessageInfo(long id, string text, DateTime date, long authorId)
        {
            Id = id;
            Text = text;
            Date = date;
            AuthorId = authorId;
        }
    }
}
