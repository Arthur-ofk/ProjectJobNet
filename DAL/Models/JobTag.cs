using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class JobTag
    {
        public Guid JobId { get; set; }
        public Job Job { get; set; }
        public Guid TagId { get; set; }
        public Tag Tag { get; set; }
    }
}
