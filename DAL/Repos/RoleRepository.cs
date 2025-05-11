using DAL.Context;
using DAL.Abstractions;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repos
{
    public class RoleRepository : GenericRepository<Role> , IRoleRepository
    {
        public RoleRepository(JobNetContext context) : base(context) { }

        public async Task<Role> GetRoleByName(string name)
        {
            var roles = await FindAsync(role => role.RoleName == name);
            return roles.FirstOrDefault();
        }
    }
}
