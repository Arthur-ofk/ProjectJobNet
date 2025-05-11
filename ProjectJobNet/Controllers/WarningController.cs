using BLL.Services.Abstractins;
using BLL.Shared.Warning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ProjectJobNet.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class WarningController : ControllerBase
    {
        private readonly IWarningService _warningService;

        public WarningController(IWarningService warningService)
        {
            _warningService = warningService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<WarningDto>>> GetAllWarnings()
        {
            var warnings = await _warningService.GetAllWarningsAsync();
            return Ok(warnings);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<WarningDto>> GetWarningById(Guid id)
        {
            var warning = await _warningService.GetWarningByIdAsync(id);
            if (warning == null)
                return NotFound();

            return Ok(warning);
        }

        [HttpPost]
        public async Task<IActionResult> AddWarning([FromBody] CreateWarningDto createWarningDto)
        {
            await _warningService.AddWarningAsync(createWarningDto);
            return CreatedAtAction(nameof(GetWarningById), new { id = createWarningDto }, createWarningDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWarning(Guid id)
        {
            await _warningService.DeleteWarningAsync(id);
            return NoContent();
        }
    }
}
