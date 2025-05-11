using AutoMapper;
using BLL.Services.Abstractins;
using BLL.Shared.LikedPost;
using DAL.Abstractions;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class LikedPostService : ILikedPostService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public LikedPostService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<LikedPostDto>> GetAllLikedPostsAsync()
        {
            var likedPosts = await _unitOfWork.LikedPostRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<LikedPostDto>>(likedPosts);
        }

        public async Task AddLikedPostAsync(CreateLikedPostDto createLikedPostDto)
        {
            var likedPost = _mapper.Map<LikedPost>(createLikedPostDto);
            likedPost.LikedAt = DateTime.Now;
            
            await _unitOfWork.LikedPostRepository.AddAsync(likedPost);
            await _unitOfWork.CompleteAsync();
        }

        public async Task RemoveLikedPostAsync(Guid userId, Guid postId)
        {
            var likedPost = await _unitOfWork.LikedPostRepository.GetByUserIdAndPostIdAsync(userId, postId);
            if (likedPost == null) return;

            _unitOfWork.LikedPostRepository.Remove(likedPost);
            await _unitOfWork.CompleteAsync();
        }
    }
}
