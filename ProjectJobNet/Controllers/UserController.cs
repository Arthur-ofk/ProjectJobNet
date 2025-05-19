using BLL.Services.Abstractins;
using BLL.Shared.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ProjectJobNet.Controllers
{
    [Authorize]
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<UserDto>> GetUserById(Guid id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> AddUser([FromBody] CreateUserDto createUserDto)
        {
            await _userService.AddUserAsync(createUserDto);
            return CreatedAtAction(nameof(GetUserById), new { id = createUserDto }, createUserDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserDto updateUserDto)
        {
            await _userService.UpdateUserAsync(id, updateUserDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            await _userService.DeleteUserAsync(id);
            return NoContent();
        }

        [HttpGet("/search/{searchParam}/{value}")]
        public async Task<IActionResult> FindByParam(string searchParam, string value)
        {
            var result = await _userService.SearchUserAsync(searchParam, value);
            return Ok(result);
        }

        [HttpPost("{id}/profile/image")]
        public async Task<IActionResult> UploadProfileImage(Guid id, IFormFile profileImage)
        {
            if (profileImage == null || profileImage.Length == 0)
                return BadRequest("No file was uploaded");

            try
            {
                var updatedUser = await _userService.UpdateProfileImageAsync(id, profileImage);
                return Ok(updatedUser);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}/profile/image")]
        public async Task<IActionResult> DeleteProfileImage(Guid id)
        {
            try
            {
                var result = await _userService.DeleteProfileImageAsync(id);
                if (!result)
                    return NotFound();
                    
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}/username")]
        [AllowAnonymous]
        public async Task<ActionResult<string>> GetUsername(Guid id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null) return NotFound();
            return Ok(user.Username);
        }
    }
}
