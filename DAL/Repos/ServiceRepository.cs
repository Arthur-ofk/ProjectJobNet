using DAL.Abstractions;
using DAL.Context;
using DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repos
{
    public class ServiceRepository : GenericRepository<Service>, IServiceRepository
    {
        public ServiceRepository(JobNetContext context) : base(context) { }

        public async Task<IEnumerable<Service>> GetServicesByOrganizationIdAsync(Guid organizationId)
        {
            return await _context.Services
                .Where(s => s.OrganizationId == organizationId)
                .ToListAsync();
        }
    }
}
