using BLL.Shared.BlogPost;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services.Abstractins
{
    public interface IBlogPostService
    {
        Task<IEnumerable<BlogPostDto>> GetAllBlogPostsAsync();
        Task<BlogPostDto> GetBlogPostByIdAsync(Guid id);
        Task AddBlogPostAsync(CreateBlogPostDto createBlogPostDto);
        Task UpdateBlogPostAsync(Guid id, UpdateBlogPostDto updateBlogPostDto);
        Task DeleteBlogPostAsync(Guid id);
    }
}
