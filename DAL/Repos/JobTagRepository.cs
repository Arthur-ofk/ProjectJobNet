using DAL.Abstractions;
using DAL.Context;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repos
{
    public class JobTagRepository : GenericRepository<JobTag>, IJobTagRepository
    {
        public JobTagRepository(JobNetContext context) : base(context) { }
    }
}
