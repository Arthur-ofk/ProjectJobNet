using BLL.Shared.BlogPost;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BLL.Services.Abstractins
{
    public interface ISavedBlogPostService
    {
        Task AddSavedPostAsync(CreateSavedBlogPostDto dto);
        Task RemoveSavedPostAsync(Guid userId, Guid blogPostId);
        Task<IEnumerable<BlogPostDto>> GetSavedPostsAsync(Guid userId);
    }
}
