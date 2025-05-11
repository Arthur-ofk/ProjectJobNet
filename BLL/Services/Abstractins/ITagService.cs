using BLL.Shared.Tag;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services.Abstractins
{
    public interface ITagService
    {
        Task<IEnumerable<TagDto>> GetAllTagsAsync();
        Task<TagDto> GetTagByIdAsync(Guid id);
        Task AddTagAsync(CreateTagDto createTagDto);
        Task UpdateTagAsync(Guid id, UpdateTagDto updateTagDto);
        Task DeleteTagAsync(Guid id);
    }
}
