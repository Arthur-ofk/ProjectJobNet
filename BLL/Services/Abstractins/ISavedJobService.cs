using BLL.Shared.SavedJob;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services.Abstractins
{
    public interface ISavedJobService
    {
        Task<IEnumerable<SavedJobDto>> GetAllSavedJobsAsync();
        Task AddSavedJobAsync(CreateSavedJobDto createSavedJobDto);
        Task RemoveSavedJobAsync(Guid employerId, Guid jobId);
    }
}
