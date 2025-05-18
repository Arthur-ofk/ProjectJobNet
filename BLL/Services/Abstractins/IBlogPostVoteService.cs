using BLL.Shared.BlogPost;
using DAL.Models;
using System;
using System.Threading.Tasks;

namespace BLL.Services.Abstractins
{
    public interface IBlogPostVoteService
    {
        Task<BlogPostVote> GetUserVoteAsync(Guid postId, Guid userId);
        Task<bool> VotePostAsync(Guid postId, Guid userId, bool isUpvote);
        Task<int> GetScoreAsync(Guid postId); // Add this method to get the post score
        Task<bool> RemoveVoteAsync(Guid postId, Guid userId); // Add this method to remove votes
    }
}
