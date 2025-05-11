using BLL.Shared.Warning;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services.Abstractins
{
    public interface IWarningService
    {
        Task<IEnumerable<WarningDto>> GetAllWarningsAsync();
        Task<WarningDto> GetWarningByIdAsync(Guid id);
        Task AddWarningAsync(CreateWarningDto createWarningDto);
        Task DeleteWarningAsync(Guid id);
    }
}
