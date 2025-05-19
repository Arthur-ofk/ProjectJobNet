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

        // Fix nullability mismatch by ensuring we don't return null
        public override async Task<OrganizationUser> GetByIdAsync(Guid id)
        {
            var entity = await _context.Set<OrganizationUser>().FindAsync(id);
            if (entity == null)
            {
                throw new KeyNotFoundException($"Entity with id {id} not found");
            }
            return entity;
        }

        // Fix potentially returning null by handling it explicitly
        public async Task<OrganizationUser> GetByUserIdAndOrgIdAsync(Guid userId, Guid orgId)
        {
            var entity = await _context.OrganizationUsers
                .FirstOrDefaultAsync(ou => ou.UserId == userId && ou.OrganizationId == orgId);
            
            if (entity == null)
            {
                throw new KeyNotFoundException($"OrganizationUser with userId {userId} and orgId {orgId} not found");
            }
            
            return entity;
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
