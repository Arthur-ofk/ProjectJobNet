using AutoMapper;
using BLL.Services.Abstractins;
using BLL.Shared.User;
using DAL.Abstractions;
using DAL.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
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

        public async Task<bool> UpdateUserAsync(Guid id, UpdateUserDto userDto)
        {
            var user = await _unitOfWork.UserRepository.GetByIdAsync(id);
            if (user == null)
                return false;
                
            _mapper.Map(userDto, user);
            user.UpdatedAt = DateTime.UtcNow;
            
            _unitOfWork.UserRepository.Update(user);
            await _unitOfWork.CompleteAsync();
            
            return true;
        }

        public async Task<bool> DeleteUserAsync(Guid id)
        {
            var user = await _unitOfWork.UserRepository.GetByIdAsync(id);
            if (user == null)
                return false;
                
            _unitOfWork.UserRepository.Remove(user);
            await _unitOfWork.CompleteAsync();
            
            return true;
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

        public async Task<bool> UpdateProfilePictureAsync(Guid id, string? profilePictureUrl)
        {
            var user = await _unitOfWork.UserRepository.GetByIdAsync(id);
            if (user == null) return false;
            
            user.ProfilePictureUrl = profilePictureUrl;
            user.UpdatedAt = DateTime.UtcNow;
            
            _unitOfWork.UserRepository.Update(user);
            await _unitOfWork.CompleteAsync();
            
            return true;
        }

        public async Task<UserDto> UpdateProfileImageAsync(Guid id, IFormFile profileImage)
        {
            var user = await _unitOfWork.UserRepository.GetByIdAsync(id);
            if (user == null)
                throw new KeyNotFoundException($"User with ID {id} not found.");

            if (profileImage != null && profileImage.Length > 0)
            {
                using var memoryStream = new MemoryStream();
                await profileImage.CopyToAsync(memoryStream);
                
                user.ProfileImageData = memoryStream.ToArray();
                user.ProfileImageContentType = profileImage.ContentType;
                user.UpdatedAt = DateTime.UtcNow;
                
                // Clear the old URL-based profile picture if it exists
                user.ProfilePictureUrl = null;
                
                _unitOfWork.UserRepository.Update(user);
                await _unitOfWork.CompleteAsync();
            }

            return _mapper.Map<UserDto>(user);
        }

        public async Task<bool> DeleteProfileImageAsync(Guid id)
        {
            var user = await _unitOfWork.UserRepository.GetByIdAsync(id);
            if (user == null)
                return false;

            user.ProfileImageData = null;
            user.ProfileImageContentType = null;
            user.ProfilePictureUrl = null;
            user.UpdatedAt = DateTime.UtcNow;
            
            _unitOfWork.UserRepository.Update(user);
            await _unitOfWork.CompleteAsync();
            
            return true;
        }
    }
}
