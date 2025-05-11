using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Shared.LikedPost
{
    public class CreateLikedPostDto
    {
        public Guid UserId { get; set; }
        public Guid PostId { get; set; }
    }
}
