namespace BLL.Shared.BlogPost
{
    public class BlogPostVoteDto
    {
        public Guid Id { get; set; }
        public Guid BlogPostId { get; set; }
        public Guid UserId { get; set; }
        public bool IsUpvote { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
