using DAL.Models;

namespace DAL.Abstractions
{
    public interface IPostCommentRepository : IGenericRepository<PostComment>
    {
        // Additional comment-specific queries may be added here
    }
}
