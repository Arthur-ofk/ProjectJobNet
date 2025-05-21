using DAL.Abstractions;
using DAL.Context;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repos
{
    public class JobRepository : GenericRepository<Job>, IJobRepository
    {
        public JobRepository(JobNetContext context) : base(context) { }

        public async Task<IEnumerable<Job>> GetJobsByOrganizationIdAsync(Guid organizationId)
        {
            return await _context.Jobs
                .Where(j => j.OrganizationId == organizationId)
                .ToListAsync();
        }
    }
}
