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
    public class ServiceTagRepository : GenericRepository<ServiceTag>, IServiceTagRepository
    {
        public ServiceTagRepository(JobNetContext context) : base(context) { }
    }
}
