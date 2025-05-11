using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Abstractions
{
    public interface IUserRepository : IGenericRepository<User> 
    {
        public Task<User> FindUserByEmailAsync(string email);
    }
}
