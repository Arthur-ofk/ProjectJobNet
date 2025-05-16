using AutoMapper;
using BLL.Services.Abstractins;
using BLL.Shared.BlogPost;
using DAL.Abstractions;
using DAL.Models;
using System;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class SavedBlogPostService : ISavedBlogPostService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public SavedBlogPostService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task AddSavedPostAsync(CreateSavedBlogPostDto dto)
        {
            var saved = _mapper.Map<SavedBlogPost>(dto);
            saved.SavedAt = DateTime.UtcNow;
            await _unitOfWork.SavedBlogPostRepository.AddAsync(saved);
            await _unitOfWork.CompleteAsync();
        }
        public async Task RemoveSavedPostAsync(Guid userId, Guid blogPostId)
        {
            var saved = await _unitOfWork.SavedBlogPostRepository.GetByUserAndPostAsync(userId, blogPostId);
            if (saved == null) return;
            _unitOfWork.SavedBlogPostRepository.Remove(saved);
            await _unitOfWork.CompleteAsync();
        }
    }
}
