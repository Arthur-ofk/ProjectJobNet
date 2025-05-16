using BLL.Shared.BlogPost;
using BLL.Shared.Service;
using System;
using System.Threading.Tasks;

namespace BLL.Services.Abstractins
{
    public interface IBlogPostVoteService
    {
        Task<ServiceVoteDto?> GetUserVoteAsync(Guid blogPostId, Guid userId);
        Task<bool> VotePostAsync(Guid blogPostId, Guid userId, bool isUpvote);
    }
}
