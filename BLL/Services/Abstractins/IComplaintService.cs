using BLL.Shared.Complaint;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services.Abstractins
{
    public interface IComplaintService
    {
        Task<IEnumerable<ComplaintDto>> GetAllComplaintsAsync();
        Task<ComplaintDto> GetComplaintByIdAsync(Guid id);
        Task AddComplaintAsync(CreateComplaintDto createComplaintDto);
        Task UpdateComplaintAsync(Guid id, UpdateComplaintDto updateComplaintDto);
        Task DeleteComplaintAsync(Guid id);
    }
}
