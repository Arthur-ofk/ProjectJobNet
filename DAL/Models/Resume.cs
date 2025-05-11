using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class Resume
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User? User { get; set; }
        public string? Content { get; set; } // Keep for text resumes if needed
        public byte[]? FileContent { get; set; } // Add for binary files (PDF, DOCX, etc.)
        public string? FileName { get; set; } // Optional: original file name
        public string? ContentType { get; set; } // Optional: MIME type
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

}
