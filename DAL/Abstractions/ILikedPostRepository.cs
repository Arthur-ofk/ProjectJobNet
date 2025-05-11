using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Abstractions
{
    public interface ILikedPostRepository : IGenericRepository<LikedPost> 
    {
        Task<LikedPost> GetByUserIdAndPostIdAsync(Guid userId, Guid postId);
    }
}


