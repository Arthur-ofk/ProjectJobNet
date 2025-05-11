using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Shared.Review
{
    public class UpdateReviewDto
    {
        public int Rating { get; set; }
        public string ReviewText { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
