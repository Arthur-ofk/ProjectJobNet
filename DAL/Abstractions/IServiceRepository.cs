using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Abstractions
{
    public interface IServiceRepository : IGenericRepository<Service> 
    { 
        Task<IEnumerable<Service>> GetServicesByOrganizationIdAsync(Guid organizationId);
    }

}
