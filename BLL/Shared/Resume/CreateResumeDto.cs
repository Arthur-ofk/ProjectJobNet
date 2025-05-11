using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Shared.Resume
{
    public class CreateResumeDto
    {
        public Guid UserId { get; set; }
        public string? Content { get; set; } // For text resumes
        public byte[]? FileContent { get; set; } // For binary files
        public string? FileName { get; set; }
        public string? ContentType { get; set; }
    }
}
