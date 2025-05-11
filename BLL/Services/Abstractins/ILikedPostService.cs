using BLL.Shared.LikedPost;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services.Abstractins
{
    public interface ILikedPostService
    {
        Task<IEnumerable<LikedPostDto>> GetAllLikedPostsAsync();
        Task AddLikedPostAsync(CreateLikedPostDto createLikedPostDto);
        Task RemoveLikedPostAsync(Guid userId, Guid postId);
    }
}
