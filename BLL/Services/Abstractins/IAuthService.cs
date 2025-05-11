using BLL.Shared.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services.Abstractins
{
    public interface IAuthService
    {
        public Task<AuthResponseDTO> RegisterAsync(RegisterDto registerDto);
        public Task<AuthResponseDTO> LoginAsync(LoginDto loginDto);
    }
}
