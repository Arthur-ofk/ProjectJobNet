using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class BlogPost
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
        public User User { get; set; }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
        public string Title { get; set; }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
        public string Content { get; set; }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public ICollection<LikedPost> LikedPosts { get; set; } = new List<LikedPost>();
        public ICollection<Complaint> Complaints { get; set; } = new List<Complaint>();
        
        // New collections for extra functionality:
        public ICollection<BlogPostVote> Votes { get; set; } = new List<BlogPostVote>();
        public ICollection<PostComment> Comments { get; set; } = new List<PostComment>();
        public ICollection<SavedBlogPost> SavedPosts { get; set; } = new List<SavedBlogPost>();
        
        // New property for storing image URL
        public string ImageUrl { get; set; } = string.Empty;
        
        // New properties for storing image binary data and its MIME type
        public byte[] ImageData { get; set; } // New property for storing image binary data
        public string ImageContentType { get; set; } // New property for storing image MIME type
    }
}
