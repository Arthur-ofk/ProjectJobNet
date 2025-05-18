using System;

namespace BLL.Shared.BlogPost
{
    public class VoteRequestDto
    {
        public Guid UserId { get; set; }
        public bool IsUpvote { get; set; }
    }
}
