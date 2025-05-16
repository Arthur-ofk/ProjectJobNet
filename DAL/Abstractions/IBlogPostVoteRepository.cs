using DAL.Models;
using System.Threading.Tasks;

namespace DAL.Abstractions
{
    public interface IBlogPostVoteRepository : IGenericRepository<BlogPostVote>
    {
        // Allow null if no vote exists.
        Task<BlogPostVote?> GetByUserAndPostAsync(Guid blogPostId, Guid userId);
    }
}
