using BLL.Services.Abstractins;
using BLL.Shared.Resume;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace ProjectJobNet.Controllers
{
    [Route("api/resumes")]
    [ApiController]
    public class ResumeController : ControllerBase
    {
        private readonly IResumeService _resumeService;

        public ResumeController(IResumeService resumeService)
        {
            _resumeService = resumeService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ResumeDto>>> GetAllResumes()
        {
            var resumes = await _resumeService.GetAllResumesAsync();
            return Ok(resumes);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ResumeDto>> GetResumeById(Guid id)
        {
            var resume = await _resumeService.GetResumeByIdAsync(id);
            if (resume == null)
                return NotFound();

            return Ok(resume);
        }

        [HttpGet("byUser/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetResumesByUser(Guid userId)
        {
            var resumes = await _resumeService.GetResumesByUserIdAsync(userId);
            return Ok(resumes);
        }

        [HttpPost]
        public async Task<IActionResult> AddResume([FromBody] CreateResumeDto createResumeDto)
        {
            await _resumeService.AddResumeAsync(createResumeDto);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateResume(Guid id, [FromBody] CreateResumeDto updateResumeDto)
        {
            await _resumeService.UpdateResumeAsync(id, updateResumeDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteResume(Guid id)
        {
            await _resumeService.DeleteResumeAsync(id);
            return NoContent();
        }

        [HttpGet("download/{id}")]
        [Authorize]
        public async Task<IActionResult> DownloadResume(Guid id)
        {
            try
            {
                var resume = await _resumeService.GetResumeByIdAsync(id);
                if (resume?.FileName == null)
                {
                    return NotFound("Resume not found or filename is missing");
                }

                // If the resume has file content
                if (resume.FileContent != null && resume.FileContent.Length > 0 && !string.IsNullOrEmpty(resume.ContentType))
                {
                    // Use the byte array directly
                    byte[] fileBytes = resume.FileContent;

                    // Return the file for download
                    return File(fileBytes, resume.ContentType ?? "application/octet-stream", resume.FileName);
                }

                // If it's just text content
                if (!string.IsNullOrEmpty(resume.Content))
                {
                    // Return as a text file
                    byte[] textBytes = System.Text.Encoding.UTF8.GetBytes(resume.Content);
                    return File(textBytes, "text/plain", $"resume_{id}.txt");
                }

                return BadRequest("Resume has no content to download");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error downloading resume: {ex.Message}");
            }
        }
    }
}
