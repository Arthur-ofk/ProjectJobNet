using AutoMapper;
using BLL.Services.Abstractins;
using BLL.Shared.Category;
using BLL.Shared.User;
using DAL.Abstractions;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CategoryService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync()
        {
            var categories = await _unitOfWork.CategoryRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<CategoryDto>>(categories);
        }

        public async Task<CategoryDto> GetCategoryByIdAsync(Guid id)
        {
            var category = await _unitOfWork.CategoryRepository.GetByIdAsync(id);
            return _mapper.Map<CategoryDto>(category);
        }

        public async Task AddCategoryAsync(CreateCategoryDto createCategoryDto)
        {
            var category = _mapper.Map<Category>(createCategoryDto);
            category.CreatedAt = DateTime.Now;
            category.UpdatedAt = DateTime.Now;

            await _unitOfWork.CategoryRepository.AddAsync(category);
            await _unitOfWork.CompleteAsync();
        }

        public async Task UpdateCategoryAsync(Guid id, UpdateCategoryDto updateCategoryDto)
        {
            var category = await _unitOfWork.CategoryRepository.GetByIdAsync(id);
            if (category == null) return;

            _mapper.Map(updateCategoryDto, category);
            category.UpdatedAt = DateTime.Now;

            _unitOfWork.CategoryRepository.Update(category);
            await _unitOfWork.CompleteAsync();
        }

        public async Task DeleteCategoryAsync(Guid id)
        {
            var category = await _unitOfWork.CategoryRepository.GetByIdAsync(id);
            if (category == null) return;

            _unitOfWork.CategoryRepository.Remove(category);
            await _unitOfWork.CompleteAsync();
        }

        public  async Task<IEnumerable<CategoryDto>> SearchCategoryAsync(string param, object value)
        {
            var parameterExpression = Expression.Parameter(typeof(Category), "category");
            var propertyExpression = Expression.Property(parameterExpression, param);
            var convertedValue = Convert.ChangeType(value, propertyExpression.Type);
            var valueExpression = Expression.Constant(convertedValue, propertyExpression.Type);
            var equalityExpression = Expression.Equal(propertyExpression, valueExpression);
            var predicate = Expression.Lambda<Func<Category, bool>>(equalityExpression, parameterExpression);
            var users = await _unitOfWork.CategoryRepository.FindAsync(predicate);
            var categoriesDto = _mapper.Map<IEnumerable<CategoryDto>>(users);
            return categoriesDto;
        }
    }
}
