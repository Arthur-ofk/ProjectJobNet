using Microsoft.AspNetCore.Http;

namespace BLL.Shared.User
{
    public class UpdateProfileImageDto
    {
        public IFormFile? ProfileImage { get; set; }
    }
}
