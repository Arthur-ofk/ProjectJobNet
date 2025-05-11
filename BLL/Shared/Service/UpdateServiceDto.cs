using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Shared.Service
{
    public class UpdateServiceDto
    {
        public string? ServiceName { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public Guid CategoryId { get; set; }
        public int Upvotes { get; set; } // Added
        public int Downvotes { get; set; } // Added
        public DateTime? UpdatedAt { get; set; }
    }
}