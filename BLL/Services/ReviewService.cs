using AutoMapper;
using BLL.Services.Abstractins;
using BLL.Shared.Review;
using DAL.Abstractions;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ReviewService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ReviewDto>> GetAllReviewsAsync()
        {
            var reviews = await _unitOfWork.ReviewRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<ReviewDto>>(reviews);
        }

        public async Task<ReviewDto> GetReviewByIdAsync(Guid id)
        {
            var review = await _unitOfWork.ReviewRepository.GetByIdAsync(id);
            return _mapper.Map<ReviewDto>(review);
        }

        public async Task AddReviewAsync(CreateReviewDto createReviewDto)
        {
            var review = _mapper.Map<Review>(createReviewDto);
            review.CreatedAt = DateTime.Now;
            review.UpdatedAt = DateTime.Now;

            await _unitOfWork.ReviewRepository.AddAsync(review);
            await _unitOfWork.CompleteAsync();
        }

        public async Task UpdateReviewAsync(Guid id, UpdateReviewDto updateReviewDto)
        {
            var review = await _unitOfWork.ReviewRepository.GetByIdAsync(id);
            if (review == null) return;

            _mapper.Map(updateReviewDto, review);
            review.UpdatedAt = DateTime.Now;

            _unitOfWork.ReviewRepository.Update(review);
            await _unitOfWork.CompleteAsync();
        }

        public async Task DeleteReviewAsync(Guid id)
        {
            var review = await _unitOfWork.ReviewRepository.GetByIdAsync(id);
            if (review == null) return;

            _unitOfWork.ReviewRepository.Remove(review);
            await _unitOfWork.CompleteAsync();
        }

        
    }
}
