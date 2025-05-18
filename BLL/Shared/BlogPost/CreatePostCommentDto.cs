using System;

namespace BLL.Shared.BlogPost
{
    public class CreatePostCommentDto
    {
        public Guid PostId { get; set; }
        public Guid UserId { get; set; }
        public string Content { get; set; }
    }
}
