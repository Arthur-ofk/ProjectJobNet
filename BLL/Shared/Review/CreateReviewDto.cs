using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Shared.Review
{
    public class CreateReviewDto
    {
        public Guid AuthorId { get; set; }
        public Guid TargetId { get; set; }
        public int Rating { get; set; }
        public string ReviewText { get; set; }
    }
}
