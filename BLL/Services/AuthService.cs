using AutoMapper;
using BLL.Services.Abstractins;
using BLL.Shared.Auth;
using BLL.Shared.User;
using DAL.Abstractions;
using DAL.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserService _userService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        public AuthService(IUserService userService, IUnitOfWork unitOfWork, IConfiguration configuration, IMapper mapper)
        {
            _userService = userService;
            _unitOfWork = unitOfWork;
            _configuration = configuration;
            _mapper = mapper;
        }

        public async Task<AuthResponseDTO> LoginAsync(LoginDto loginDto)
        {
           
            var user = await _unitOfWork.UserRepository.FindUserByEmailAsync(loginDto.email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid email or password.");
            }

           
            var token = GenerateJwtToken(user);

            
            var userDto = _mapper.Map<UserDto>(user);
            return new AuthResponseDTO
            {
                token = token,
                user = userDto
            };
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Username)
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<AuthResponseDTO> RegisterAsync(RegisterDto registerDto)
        {
            // Перевірка наявності користувача з таким email
            //var existingUser = await _unitOfWork.UserRepository.FindUserByEmailAsync(registerDto.Email);
            //if (existingUser != null)
            //{
            //    throw new Exception("User with this email already exists.");
            //}

            if (! (await _userService.SearchUserAsync("UserName",registerDto.Username)).IsNullOrEmpty())
            {
                throw new Exception("User with this email already exists.");
            }
            if (!(await _userService.SearchUserAsync("Email", registerDto.Email)).IsNullOrEmpty())
            {
                throw new Exception("User with this email already exists.");
            }


            // Мапимо RegisterDto у User
            var newUser = _mapper.Map<User>(registerDto);

            // Додаємо додаткові поля вручну
            newUser.RoleId = _unitOfWork.RoleRepository.GetRoleByName("User").Result.Id;
            newUser.Id = Guid.NewGuid(); 
            newUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);
            newUser.CreatedAt = DateTime.Now;
            newUser.UpdatedAt = DateTime.Now;

            // Додаємо користувача в базу
            await _unitOfWork.UserRepository.AddAsync(newUser);
            await _unitOfWork.CompleteAsync();

            // Генерація JWT токена
            var token = GenerateJwtToken(newUser);

            // Мапимо User у UserDto і формуємо відповідь
            var userDto = _mapper.Map<UserDto>(newUser);
            return new AuthResponseDTO
            {
                token = token,
                user = userDto
            };
        }
    }
}
