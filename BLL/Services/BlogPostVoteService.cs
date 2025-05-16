using AutoMapper;
using BLL.Services.Abstractins;
using BLL.Shared.BlogPost;
using BLL.Shared.Service;
using DAL.Abstractions;
using DAL.Models;
using System;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class BlogPostVoteService : IBlogPostVoteService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public BlogPostVoteService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<ServiceVoteDto?> GetUserVoteAsync(Guid blogPostId, Guid userId)
        {
            var vote = await _unitOfWork.BlogPostVoteRepository.GetByUserAndPostAsync(blogPostId, userId);
            if (vote == null) return null;
            return _mapper.Map<ServiceVoteDto>(vote);
        }
        public async Task<bool> VotePostAsync(Guid blogPostId, Guid userId, bool isUpvote)
        {
            var existingVote = await _unitOfWork.BlogPostVoteRepository.GetByUserAndPostAsync(blogPostId, userId);
            if (existingVote != null)
            {
                if (existingVote.IsUpvote == isUpvote)
                    _unitOfWork.BlogPostVoteRepository.Remove(existingVote);
                else
                {
                    existingVote.IsUpvote = isUpvote;
                    existingVote.CreatedAt = DateTime.UtcNow;
                    _unitOfWork.BlogPostVoteRepository.Update(existingVote);
                }
            }
            else
            {
                await _unitOfWork.BlogPostVoteRepository.AddAsync(new BlogPostVote
                {
                    Id = Guid.NewGuid(),
                    BlogPostId = blogPostId,
                    UserId = userId,
                    IsUpvote = isUpvote,
                    CreatedAt = DateTime.UtcNow
                });
            }
            await _unitOfWork.CompleteAsync();
            return true;
        }
    }
}
