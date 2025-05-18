using DAL.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DAL.Abstractions
{
    public interface IOrganizationUserRepository : IGenericRepository<OrganizationUser>
    {
        Task<IEnumerable<OrganizationUser>> GetByOrganizationIdAsync(Guid organizationId);
        Task<IEnumerable<OrganizationUser>> GetByUserIdAsync(Guid userId);
        Task<OrganizationUser> GetByOrganizationAndUserIdAsync(Guid organizationId, Guid userId);
    }
}
