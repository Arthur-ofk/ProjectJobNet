using BLL.Shared.BlogPost;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BLL.Services.Abstractins
{
    public interface IPostCommentService
    {
        Task<IEnumerable<PostCommentDto>> GetCommentsByPostAsync(Guid blogPostId);
        Task AddCommentAsync(CreatePostCommentDto dto);
        Task UpdateCommentAsync(Guid commentId, UpdatePostCommentDto dto);
        Task DeleteCommentAsync(Guid commentId);
    }
}
