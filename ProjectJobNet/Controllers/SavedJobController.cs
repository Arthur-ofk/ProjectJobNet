using BLL.Services.Abstractins;
using BLL.Shared.SavedJob;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ProjectJobNet.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SavedJobController : ControllerBase
    {
        private readonly ISavedJobService _savedJobService;

        public SavedJobController(ISavedJobService savedJobService)
        {
            _savedJobService = savedJobService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SavedJobDto>>> GetAllSavedJobs()
        {
            var savedJobs = await _savedJobService.GetAllSavedJobsAsync();
            return Ok(savedJobs);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetSavedJobsByUser(Guid userId)
        {
            try
            {
                // Ensure we only return saved jobs that belong to the specified user
                var savedJobs = await _savedJobService.GetAllSavedJobsAsync();
                    var belongingJobs = savedJobs.Where(job => job.EmployerId == userId).ToList();

                return Ok(savedJobs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddSavedJob([FromBody] CreateSavedJobDto createSavedJobDto)
        {
            await _savedJobService.AddSavedJobAsync(createSavedJobDto);
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> RemoveSavedJob(Guid employerId, Guid jobId)
        {
            await _savedJobService.RemoveSavedJobAsync(employerId, jobId);
            return NoContent();
        }
    }
}
