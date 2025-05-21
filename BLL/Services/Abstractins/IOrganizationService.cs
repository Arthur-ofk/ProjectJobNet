using BLL.Shared.Organization;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BLL.Services.Abstractins
{
    public interface IOrganizationService
    {
        Task<IEnumerable<OrganizationDto>> GetAllOrganizationsAsync();
        Task<OrganizationDto> GetOrganizationByIdAsync(Guid id);
        Task<IEnumerable<OrganizationDto>> GetOrganizationsByUserIdAsync(Guid userId);
        Task<OrganizationDto> CreateOrganizationAsync(CreateOrganizationDto dto);
        Task UpdateOrganizationAsync(Guid id, UpdateOrganizationDto dto);
        Task DeleteOrganizationAsync(Guid id);
        Task<IEnumerable<OrganizationUserDto>> GetOrganizationMembersAsync(Guid organizationId);
        Task AddUserToOrganizationAsync(AddUserDto dto);
        Task RemoveUserFromOrganizationAsync(Guid organizationId, Guid userId);
        Task<OrganizationUserDto> UpdateUserRoleAsync(Guid organizationId, Guid userId, string role);
        Task<bool> IsOwnerAsync(Guid organizationId, Guid userId);
        Task<OrganizationDetailsDto> GetOrganizationDetailsAsync(Guid organizationId);
    }
}
