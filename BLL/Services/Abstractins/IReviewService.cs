using BLL.Shared.Review;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services.Abstractins
{
    public interface IReviewService
    {
        Task<IEnumerable<ReviewDto>> GetAllReviewsAsync();
        Task<ReviewDto> GetReviewByIdAsync(Guid id);
        Task AddReviewAsync(CreateReviewDto createReviewDto);
        Task UpdateReviewAsync(Guid id, UpdateReviewDto updateReviewDto);
        Task DeleteReviewAsync(Guid id);
    }
}
