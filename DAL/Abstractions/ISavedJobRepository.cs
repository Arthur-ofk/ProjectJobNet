using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Abstractions
{
    public interface ISavedJobRepository : IGenericRepository<SavedJob>
    {
        Task<SavedJob> GetByEmployerIdAndJobIdAsync(Guid employerId, Guid jobId);
    }

}
