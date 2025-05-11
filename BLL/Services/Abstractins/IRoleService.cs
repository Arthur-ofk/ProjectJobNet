using BLL.Shared.Role;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services.Abstractins
{
    public interface IRoleService
    {
        Task<IEnumerable<RoleDto>> GetAllRolesAsync();
        Task<RoleDto> GetRoleByIdAsync(Guid id);
        Task AddRoleAsync(CreateRoleDto createRoleDto);
        Task UpdateRoleAsync(Guid id, UpdateRoleDto updateRoleDto);
        Task DeleteRoleAsync(Guid id);
    }
}
