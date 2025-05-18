using DAL.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DAL.Abstractions
{
    public interface IOrganizationRepository : IGenericRepository<Organization>
    {
        Task<IEnumerable<Organization>> GetOrganizationsByUserIdAsync(Guid userId);
    }
}
