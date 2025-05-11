using AutoMapper;

using BLL.Services.Abstractins;
using BLL.Shared.User;
using DAL.Abstractions;
using DAL.Models;
using Org.BouncyCastle.Crypto.Generators;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public UserService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _unitOfWork.UserRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        public async Task<UserDto> GetUserByIdAsync(Guid id)
        {
            var user = await _unitOfWork.UserRepository.GetByIdAsync(id);
            return _mapper.Map<UserDto>(user);
        }

        public async Task AddUserAsync(CreateUserDto createUserDto)
        {
            var user = _mapper.Map<User>(createUserDto);
            user.CreatedAt = DateTime.Now;
            user.UpdatedAt = DateTime.Now; ;
            
                await _unitOfWork.UserRepository.AddAsync(user);
            await _unitOfWork.CompleteAsync();
        }

        public async Task UpdateUserAsync(Guid id, UpdateUserDto updateUserDto)
        {
            var user = await _unitOfWork.UserRepository.GetByIdAsync(id);
            if (user == null) return;

            _mapper.Map(updateUserDto, user);
            user.UpdatedAt = DateTime.Now;

            _unitOfWork.UserRepository.Update(user);
            await _unitOfWork.CompleteAsync();
        }

        public async Task DeleteUserAsync(Guid id)
        {
            var user = await _unitOfWork.UserRepository.GetByIdAsync(id);
            if (user == null) return;

            _unitOfWork.UserRepository.Remove(user);
            await _unitOfWork.CompleteAsync();
        }
        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public async Task<IEnumerable<UserDto>> SearchUserAsync(string param, object value)
        {
            var parameterExpression = Expression.Parameter(typeof(User), "user");
            var propertyExpression = Expression.Property(parameterExpression, param);
            var convertedValue = Convert.ChangeType(value, propertyExpression.Type);
            var valueExpression = Expression.Constant(convertedValue, propertyExpression.Type);
            var equalityExpression = Expression.Equal(propertyExpression, valueExpression);
            var predicate = Expression.Lambda<Func<User, bool>>(equalityExpression, parameterExpression);
            var users = await _unitOfWork.UserRepository.FindAsync(predicate);
            var usersDto = _mapper.Map<IEnumerable<UserDto>>(users);
            return usersDto;
        }
    }
}
