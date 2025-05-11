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
