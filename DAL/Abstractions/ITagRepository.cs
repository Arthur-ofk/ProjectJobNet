using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Abstractions
{
    public interface ITagRepository : IGenericRepository<Tag>
    {
        // Методи, специфічні для Tag
        Task<IEnumerable<Tag>> GetPopularTagsAsync();
    }
}
