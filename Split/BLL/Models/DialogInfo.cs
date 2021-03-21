using System;

namespace Split.BLL.Models
{
    [Serializable]
    public class DialogInfo
    {
        public long Id { get; set; }

        public string Name { get; set; }

        public string ImageUrl { get; set; }

        public bool IsDirect { get; set; }

        public DialogInfo() : this(0, "Unknown Dialog", "/images/icon.png", false)
        { }

        public DialogInfo(long id, string name, string imageUrl, bool isDirect)
        {
            Id = id;
            Name = name;
            ImageUrl = imageUrl;
            IsDirect = isDirect;
        }
    }
}
