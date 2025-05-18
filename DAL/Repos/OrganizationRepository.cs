using DAL.Abstractions;
using DAL.Context;
using DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DAL.Repos
{
    public class OrganizationRepository : GenericRepository<Organization>, IOrganizationRepository
    {
        public OrganizationRepository(JobNetContext context) : base(context)
        {
        }
        
        public async Task<IEnumerable<Organization>> GetOrganizationsByUserIdAsync(Guid userId)
        {
            return await _context.OrganizationUsers
                .Where(ou => ou.UserId == userId)
                .Select(ou => ou.Organization)
                .ToListAsync();
        }
    }
}
