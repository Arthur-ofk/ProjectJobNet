using BLL.Shared.Category;
using BLL.Shared.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services.Abstractins
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync();
        Task<CategoryDto> GetCategoryByIdAsync(Guid id);
        Task AddCategoryAsync(CreateCategoryDto createCategoryDto);
        Task UpdateCategoryAsync(Guid id, UpdateCategoryDto updateCategoryDto);
        Task DeleteCategoryAsync(Guid id);
        Task<IEnumerable<CategoryDto>> SearchCategoryAsync(string param, object value);
    }
}
