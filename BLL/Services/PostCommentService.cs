using AutoMapper;
using BLL.Services.Abstractins;
using BLL.Shared.BlogPost;
using DAL.Abstractions;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class PostCommentService : IPostCommentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public PostCommentService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<IEnumerable<PostCommentDto>> GetCommentsByPostIdAsync(Guid postId)
        {
            try
            {
                // Check if the blog post exists
                var blogPost = await _unitOfWork.BlogPostRepository.GetByIdAsync(postId);
                if (blogPost == null)
                    return Enumerable.Empty<PostCommentDto>();
                
                // Use BlogPostId instead of PostId
                var comments = await _unitOfWork.PostCommentRepository.FindAsync(c => c.BlogPostId == postId);
                
                // Return empty list instead of null
                if (comments == null) 
                    return Enumerable.Empty<PostCommentDto>();
                
                return _mapper.Map<IEnumerable<PostCommentDto>>(comments);
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error in GetCommentsByPostIdAsync: {ex}");
                throw;
            }
        }

        public async Task<PostCommentDto> AddCommentAsync(CreatePostCommentDto dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));
            
            // Validate required fields
            if (dto.PostId == Guid.Empty)
                throw new ArgumentException("PostId is required");
                
            if (dto.UserId == Guid.Empty)
                throw new ArgumentException("UserId is required");
                
            if (string.IsNullOrWhiteSpace(dto.Content))
                throw new ArgumentException("Content cannot be empty");

            try
            {
                // Check if the blog post exists
                var blogPost = await _unitOfWork.BlogPostRepository.GetByIdAsync(dto.PostId);
                if (blogPost == null)
                    throw new InvalidOperationException($"Blog post with ID {dto.PostId} not found");

                // Check if the user exists
                var user = await _unitOfWork.UserRepository.GetByIdAsync(dto.UserId);
                if (user == null)
                    throw new InvalidOperationException($"User with ID {dto.UserId} not found");

                // Map DTO to entity, setting BlogPostId from PostId
                var comment = new PostComment
                {
                    Id = Guid.NewGuid(),
                    BlogPostId = dto.PostId, // Map dto.PostId to entity.BlogPostId
                    UserId = dto.UserId,
                    Content = dto.Content,
                    CreatedAt = DateTime.UtcNow
                };
                
                // Add to database
                await _unitOfWork.PostCommentRepository.AddAsync(comment);
                await _unitOfWork.CompleteAsync();
                
                // Return mapped DTO
                return _mapper.Map<PostCommentDto>(comment);
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error in AddCommentAsync: {ex}");
                throw;
            }
        }

        public async Task<bool> DeleteCommentAsync(Guid id)
        {
            try
            {
                var comment = await _unitOfWork.PostCommentRepository.GetByIdAsync(id);
                if (comment == null) return false;
                
                _unitOfWork.PostCommentRepository.Remove(comment);
                await _unitOfWork.CompleteAsync();
                
                return true;
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error in DeleteCommentAsync: {ex}");
                throw;
            }
        }
    }
}
