using System;

namespace Split.BLL.Models
{
    [Serializable]
    public class AccountInfo
    {
        public long Id { get; set; }

        public string Username { get; set; }

        public string ImageUrl { get; set; }

        public AccountInfo() : this(0, "Unknown", "/images/icon.png")
        { }

        public AccountInfo(long id, string username, string imageUrl)
        {
            Id = id;
            Username = username;
            ImageUrl = imageUrl;
        }
    }
}
