using DAL.Abstractions;
using DAL.Context;
using DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repos
{
    public class TagRepository : GenericRepository<Tag>, ITagRepository
    {
        public TagRepository(JobNetContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Tag>> GetPopularTagsAsync()
        {
           
            return await _context.Tags.OrderByDescending(t => t.TagName).Take(10).ToListAsync();
        }
    }
}
