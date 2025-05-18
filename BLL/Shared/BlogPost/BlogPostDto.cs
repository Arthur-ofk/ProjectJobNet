using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace BLL.Shared.BlogPost
{
    public class BlogPostDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public Guid UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // Voting properties
        public int Upvotes { get; set; }
        public int Downvotes { get; set; }
        
        // Image data
        public byte[]? ImageData { get; set; }
        public string? ImageContentType { get; set; }
        
        // Comment count instead of collection to avoid circular references
        public int Comments { get; set; }
        
        // Additional computed properties
        public int Likes => Upvotes; // For backward compatibility
    }
}
