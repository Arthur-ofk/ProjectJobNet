using AutoMapper;
using BLL.Services.Abstractins;
using BLL.Shared.BlogPost;
using DAL.Abstractions;
using DAL.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class BlogPostVoteService : IBlogPostVoteService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public BlogPostVoteService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<BlogPostVoteDto> GetVoteAsync(Guid postId, Guid userId)
        {
            // Fix: Change 'PostId' to 'BlogPostId' to match the model property name
            var votes = await _unitOfWork.BlogPostVoteRepository.FindAsync(v => v.BlogPostId == postId && v.UserId == userId);
            var votesList = votes.ToList();
            
            if (!votesList.Any())
            {
                // Return a default DTO without using the Voted property
                return new BlogPostVoteDto
                {
                    PostId = postId,
                    UserId = userId,
                    IsUpvote = false
                };
            }
            
            var vote = votesList.First();
            return vote != null ? _mapper.Map<BlogPostVoteDto>(vote) : new BlogPostVoteDto
            {
                PostId = postId,
                UserId = userId,
                IsUpvote = false
            };
        }

        public async Task<BlogPostVote> GetUserVoteAsync(Guid postId, Guid userId)
        {
            try
            {
                var votes = await _unitOfWork.BlogPostVoteRepository.FindAsync(v => 
                    v.BlogPostId == postId && v.UserId == userId);
                
                return votes.FirstOrDefault();
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error in GetUserVoteAsync: {ex}");
                throw;
            }
        }

        public async Task<bool> VotePostAsync(Guid postId, Guid userId, bool isUpvote)
        {
            try
            {
                // Check if the blog post exists
                var post = await _unitOfWork.BlogPostRepository.GetByIdAsync(postId);
                if (post == null)
                    throw new InvalidOperationException($"Blog post with ID {postId} not found");

                // Check if user has already voted
                var existingVote = await GetUserVoteAsync(postId, userId);
                
                if (existingVote != null)
                {
                    // Update existing vote if the vote type is different
                    if (existingVote.IsUpvote != isUpvote)
                    {
                        existingVote.IsUpvote = isUpvote;
                        _unitOfWork.BlogPostVoteRepository.Update(existingVote);
                        await _unitOfWork.CompleteAsync();
                    }
                }
                else
                {
                    // Create new vote
                    var vote = new BlogPostVote
                    {
                        Id = Guid.NewGuid(),
                        BlogPostId = postId,
                        UserId = userId,
                        IsUpvote = isUpvote,
                        CreatedAt = DateTime.UtcNow
                    };
                    
                    await _unitOfWork.BlogPostVoteRepository.AddAsync(vote);
                    await _unitOfWork.CompleteAsync();
                }
                
                return true;
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error in VotePostAsync: {ex}");
                throw;
            }
        }

        public async Task<bool> RemoveVoteAsync(Guid postId, Guid userId)
        {
            try
            {
                // Check if blog post exists
                var post = await _unitOfWork.BlogPostRepository.GetByIdAsync(postId);
                if (post == null)
                    throw new InvalidOperationException($"Blog post with ID {postId} not found");

                // Check if vote exists
                var existingVote = await GetUserVoteAsync(postId, userId);
                if (existingVote == null)
                    return false; // Nothing to remove
                
                // Remove the vote
                _unitOfWork.BlogPostVoteRepository.Remove(existingVote);
                await _unitOfWork.CompleteAsync();
                
                return true;
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error in RemoveVoteAsync: {ex}");
                throw;
            }
        }

        public async Task<int> GetScoreAsync(Guid postId)
        {
            var votes = await _unitOfWork.BlogPostVoteRepository.FindAsync(v => v.BlogPostId == postId);
            if (votes == null || !votes.Any())
                return 0;
                
            int upvotes = votes.Count(v => v.IsUpvote);
            int downvotes = votes.Count(v => !v.IsUpvote);
            
            return upvotes - downvotes;
        }
    }
}
