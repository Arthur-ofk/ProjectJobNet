using System;

namespace DAL.Models
{
    public class BlogPostVote
    {
        public Guid Id { get; set; }
        public Guid BlogPostId { get; set; }
        public virtual BlogPost BlogPost { get; set; }
        public Guid UserId { get; set; }
        public virtual User User { get; set; }
        public bool IsUpvote { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
