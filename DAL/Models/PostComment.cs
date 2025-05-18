using System;

namespace DAL.Models
{
    public class PostComment
    {
        public Guid Id { get; set; }
        
        // Change property name to match database column
        public Guid BlogPostId { get; set; }
        
        public virtual BlogPost BlogPost { get; set; }
        public Guid UserId { get; set; }
        public virtual User User { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
