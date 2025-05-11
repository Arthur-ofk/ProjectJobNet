using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Shared.BlogPost
{
    public class UpdateBlogPostDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
