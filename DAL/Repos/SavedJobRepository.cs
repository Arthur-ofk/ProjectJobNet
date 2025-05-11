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
    public class SavedJobRepository : GenericRepository<SavedJob>, ISavedJobRepository
    {
        public SavedJobRepository(JobNetContext context) : base(context) { }
        public async Task<SavedJob> GetByEmployerIdAndJobIdAsync(Guid employerId, Guid jobId)
        {
            return await _context.SavedJobs
                .FirstOrDefaultAsync(sj => sj.EmployerId == employerId && sj.JobId == jobId);
        }
    }
}
