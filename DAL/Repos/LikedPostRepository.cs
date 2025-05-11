using DAL.Abstractions;
using DAL.Context;
using DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repos
{
    public class LikedPostRepository : GenericRepository<LikedPost>, ILikedPostRepository
    {
        public LikedPostRepository(JobNetContext context) : base(context) { }

        public async Task<LikedPost> GetByUserIdAndPostIdAsync(Guid userId, Guid postId)
        {
            return await _context.LikedPosts
                .FirstOrDefaultAsync(lp => lp.UserId == userId && lp.PostId == postId);
        }
    }
}
