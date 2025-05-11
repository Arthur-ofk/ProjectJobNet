using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class ServiceTag
    {
        public Guid ServiceId { get; set; }
        public Service Service { get; set; }
        public Guid TagId { get; set; }
        public Tag Tag { get; set; }
    }
}
