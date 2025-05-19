using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Shared.User
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? PasswordHash { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
        
        // Include profile image data
        public byte[]? ProfileImageData { get; set; }
        public string? ProfileImageContentType { get; set; }
        public string? ProfilePictureUrl { get; set; }
        
        public Guid RoleId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
