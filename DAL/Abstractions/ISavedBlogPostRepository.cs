using DAL.Models;
using System.Threading.Tasks;

namespace DAL.Abstractions
{
    public interface ISavedBlogPostRepository : IGenericRepository<SavedBlogPost>
    {
        Task<SavedBlogPost?> GetByUserAndPostAsync(Guid userId, Guid blogPostId);
    }
}
