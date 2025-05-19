using BLL.Shared.Job;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services.Abstractins
{
    public interface IJobService
    {
        Task<IEnumerable<JobDto>> GetAllJobsAsync();
        Task<JobDto> GetJobByIdAsync(Guid id);
        Task AddJobAsync(CreateJobDto createJobDto);
        Task UpdateJobAsync(Guid id, UpdateJobDto updateJobDto);
        Task DeleteJobAsync(Guid id);
        
        Task<IEnumerable<JobDto>> GetJobsByOrganizationIdAsync(Guid organizationId);
    }
}
