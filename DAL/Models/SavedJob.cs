using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class SavedJob
    {
        public Guid EmployerId { get; set; }
        public User Employer { get; set; }
        public Guid JobId { get; set; }
        public Job Job { get; set; }
        public DateTime SavedAt { get; set; }
    }
}
