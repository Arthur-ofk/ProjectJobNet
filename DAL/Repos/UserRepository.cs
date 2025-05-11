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
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(JobNetContext context) : base(context) { }

        public async Task<User> FindUserByEmailAsync(string email)
        {
           var users = await FindAsync(user => user.Email == email);
            return users.FirstOrDefault();
        }
    }
}
