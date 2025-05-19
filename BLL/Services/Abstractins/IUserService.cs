using BLL.Shared.User;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services.Abstractins
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task<UserDto> GetUserByIdAsync(Guid id);
        Task AddUserAsync(CreateUserDto createUserDto);
        Task<bool> UpdateUserAsync(Guid id, UpdateUserDto userDto);
        Task<bool> DeleteUserAsync(Guid id);
        Task<IEnumerable<UserDto>>SearchUserAsync(string param, object  value);
        Task<bool> UpdateProfilePictureAsync(Guid id, string? profilePictureUrl);
    }
}
