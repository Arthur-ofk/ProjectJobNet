using BLL.Services.Abstractins;
using BLL.Shared.Job;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ProjectJobNet.Controllers
{
    [Authorize]
    [Route("api/jobs")]
    [ApiController]
    public class JobController : ControllerBase
    {
        private readonly IJobService _jobService;

        public JobController(IJobService jobService)
        {
            _jobService = jobService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<JobDto>>> GetAllJobs()
        {
            var jobs = await _jobService.GetAllJobsAsync();
            return Ok(jobs);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<JobDto>> GetJobById(Guid id)
        {
            var job = await _jobService.GetJobByIdAsync(id);
            if (job == null)
                return NotFound();

            return Ok(job);
        }

        [HttpPost]
        public async Task<IActionResult> AddJob([FromBody] CreateJobDto createJobDto)
        {
            await _jobService.AddJobAsync(createJobDto);
            return CreatedAtAction(nameof(GetJobById), new { id = createJobDto }, createJobDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJob(Guid id, [FromBody] UpdateJobDto updateJobDto)
        {
            await _jobService.UpdateJobAsync(id, updateJobDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(Guid id)
        {
            await _jobService.DeleteJobAsync(id);
            return NoContent();
        }
    }
}
