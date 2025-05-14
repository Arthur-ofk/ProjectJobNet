using BLL.Shared.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services.Abstractins
{
    public interface IServiceService
    {
        Task<IEnumerable<ServiceDto>> GetAllServicesAsync();
        Task<ServiceDto> GetServiceByIdAsync(Guid id);
        Task AddServiceAsync(CreateServiceDto createServiceDto);
        Task UpdateServiceAsync(Guid id, CreateServiceDto updateServiceDto);
        Task DeleteServiceAsync(Guid id);
       
        Task<ServiceVoteDto?> GetUserVoteAsync(Guid serviceId, Guid userId);
        Task<bool> HasUserUsedService(Guid id, Guid userId);
        Task<bool> VoteServiceAsync(Guid id, Guid userId, bool isUpvote);
    }
}
