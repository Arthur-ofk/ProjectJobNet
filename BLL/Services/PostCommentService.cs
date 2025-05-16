using AutoMapper;
using BLL.Services.Abstractins;
using BLL.Shared.BlogPost;
using DAL.Abstractions;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class PostCommentService : IPostCommentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public PostCommentService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<IEnumerable<PostCommentDto>> GetCommentsByPostAsync(Guid blogPostId)
        {
            var comments = await _unitOfWork.PostCommentRepository.FindAsync(c => c.BlogPostId == blogPostId);
            return _mapper.Map<IEnumerable<PostCommentDto>>(comments);
        }
        public async Task AddCommentAsync(CreatePostCommentDto dto)
        {
            var comment = _mapper.Map<PostComment>(dto);
            comment.Id = Guid.NewGuid();
            comment.CreatedAt = DateTime.UtcNow;
            await _unitOfWork.PostCommentRepository.AddAsync(comment);
            await _unitOfWork.CompleteAsync();
        }
        public async Task UpdateCommentAsync(Guid commentId, UpdatePostCommentDto dto)
        {
            var comment = await _unitOfWork.PostCommentRepository.GetByIdAsync(commentId);
            if (comment == null) return;
            _mapper.Map(dto, comment);
            comment.UpdatedAt = DateTime.UtcNow;
            _unitOfWork.PostCommentRepository.Update(comment);
            await _unitOfWork.CompleteAsync();
        }
        public async Task DeleteCommentAsync(Guid commentId)
        {
            var comment = await _unitOfWork.PostCommentRepository.GetByIdAsync(commentId);
            if (comment == null) return;
            _unitOfWork.PostCommentRepository.Remove(comment);
            await _unitOfWork.CompleteAsync();
        }
    }
}
