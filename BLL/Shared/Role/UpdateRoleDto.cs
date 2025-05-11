using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Shared.Role
{
    public class UpdateRoleDto
    {
        public string RoleName { get; set; }
        public string Description { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
