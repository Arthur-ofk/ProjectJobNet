using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Abstractions
{
    public interface IRoleRepository :IGenericRepository<Role>
    {
        public Task<Role> GetRoleByName(string name);

    }
}
