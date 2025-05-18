using BLL.Shared.BlogPost;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BLL.Services.Abstractins
{
    public interface IPostCommentService
    {
        Task<IEnumerable<PostCommentDto>> GetCommentsByPostIdAsync(Guid postId);
        Task<PostCommentDto> AddCommentAsync(CreatePostCommentDto dto);
        Task<bool> DeleteCommentAsync(Guid id);
    }
}
