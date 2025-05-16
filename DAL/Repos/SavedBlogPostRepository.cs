using DAL.Abstractions;
using DAL.Context;
using DAL.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace DAL.Repos
{
    public class SavedBlogPostRepository : GenericRepository<SavedBlogPost>, ISavedBlogPostRepository
    {
        public SavedBlogPostRepository(JobNetContext context) : base(context) { }
        public async Task<SavedBlogPost?> GetByUserAndPostAsync(Guid userId, Guid blogPostId)
        {
            return await _context.Set<SavedBlogPost>()
                .FirstOrDefaultAsync(sp => sp.UserId == userId && sp.BlogPostId == blogPostId);
        }
    }
}
