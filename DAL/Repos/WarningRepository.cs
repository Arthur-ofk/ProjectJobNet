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
    public class WarningRepository : GenericRepository<Warning>, IWarningRepository
    {
        public WarningRepository(JobNetContext context) : base(context) { }
    }
}
