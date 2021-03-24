using System;
using System.Collections.Generic;

namespace Split.BLL.Models
{
    [Serializable]
    public class DialogInfo
    {
        public long Id { get; set; }

        public string Name { get; set; }

        public string ImageUrl { get; set; }

        public long LastReadMessageId { get; set; }

        public IEnumerable<long> MembersIds { get; set; }

        public DialogInfo() : this(0, "Unknown Dialog", "/images/icon.png", 0, new long[0])
        { }

        public DialogInfo(long id, string name, string imageUrl, long lastReadMessageId, IEnumerable<long> membersIds)
        {
            Id = id;
            Name = name;
            ImageUrl = imageUrl;
            MembersIds = membersIds;
            LastReadMessageId = lastReadMessageId;
        }
    }
}
