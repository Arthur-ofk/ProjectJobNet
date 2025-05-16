using DAL.Abstractions;
using DAL.Context;
using DAL.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace DAL.Repos
{
    public class BlogPostVoteRepository : GenericRepository<BlogPostVote>, IBlogPostVoteRepository
    {
        public BlogPostVoteRepository(JobNetContext context) : base(context) { }
        public async Task<BlogPostVote?> GetByUserAndPostAsync(Guid blogPostId, Guid userId)
        {
            // May return null if no vote exists.
            return await _context.Set<BlogPostVote>()
                .FirstOrDefaultAsync(v => v.BlogPostId == blogPostId && v.UserId == userId);
        }
    }
}
