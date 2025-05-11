using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class Complaint
    {
        public Guid Id { get; set; }
        public Guid ComplainantId { get; set; }
        public User Complainant { get; set; }
        public Guid TargetPostId { get; set; }
        public BlogPost TargetPost { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public DateTime SubmittedAt { get; set; }
    }
}
