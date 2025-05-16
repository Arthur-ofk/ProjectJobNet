namespace BLL.Shared.BlogPost
{
    public class SavedBlogPostDto
    {
        public Guid UserId { get; set; }
        public Guid BlogPostId { get; set; }
        public DateTime SavedAt { get; set; }
    }
}
