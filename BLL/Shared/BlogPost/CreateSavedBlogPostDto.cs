namespace BLL.Shared.BlogPost
{
    public class CreateSavedBlogPostDto
    {
        public Guid UserId { get; set; }
        public Guid BlogPostId { get; set; }
    }
}
