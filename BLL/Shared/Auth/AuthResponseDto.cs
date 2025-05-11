using BLL.Shared.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Shared.Auth
{
    public class AuthResponseDTO
    {
        public string token {  get; set; }
        public UserDto user { get; set; }
    }
}
