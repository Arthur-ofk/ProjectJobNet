using BLL.Shared.Resume;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services.Abstractins
{
    public interface IResumeService
    {
        Task<IEnumerable<ResumeDto>> GetAllResumesAsync();
        Task<ResumeDto> GetResumeByIdAsync(Guid id);
        Task AddResumeAsync(CreateResumeDto createResumeDto);
        Task UpdateResumeAsync(Guid id, CreateResumeDto updateResumeDto);
        Task DeleteResumeAsync(Guid id);
    }
}
