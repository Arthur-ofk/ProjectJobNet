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
    public class OrganizationUserRepository : GenericRepository<OrganizationUser>, IOrganizationUserRepository
    {
        public OrganizationUserRepository(JobNetContext context) : base(context)
        {
        }
        
        public async Task<IEnumerable<OrganizationUser>> GetByOrganizationIdAsync(Guid organizationId)
        {
            return await _context.OrganizationUsers
                .Where(ou => ou.OrganizationId == organizationId)
                .Include(ou => ou.User)
                .ToListAsync();
        }
        
        public async Task<IEnumerable<OrganizationUser>> GetByUserIdAsync(Guid userId)
        {
            return await _context.OrganizationUsers
                .Where(ou => ou.UserId == userId)
                .Include(ou => ou.Organization)
                .ToListAsync();
        }
        
        public async Task<OrganizationUser> GetByOrganizationAndUserIdAsync(Guid organizationId, Guid userId)
        {
            return await _context.OrganizationUsers
                .FirstOrDefaultAsync(ou => ou.OrganizationId == organizationId && ou.UserId == userId);
        }
    }
}
