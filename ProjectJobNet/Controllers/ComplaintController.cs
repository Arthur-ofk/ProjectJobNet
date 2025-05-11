using BLL.Services.Abstractins;
using BLL.Shared.Complaint;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ProjectJobNet.Controllers
{
    [Authorize]
    [Route("api/complaints")]
    [ApiController]
    public class ComplaintController : ControllerBase
    {
        private readonly IComplaintService _complaintService;

        public ComplaintController(IComplaintService complaintService)
        {
            _complaintService = complaintService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ComplaintDto>>> GetAllComplaints()
        {
            var complaints = await _complaintService.GetAllComplaintsAsync();
            return Ok(complaints);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ComplaintDto>> GetComplaintById(Guid id)
        {
            var complaint = await _complaintService.GetComplaintByIdAsync(id);
            if (complaint == null)
                return NotFound();

            return Ok(complaint);
        }

        [HttpPost]
        public async Task<IActionResult> AddComplaint([FromBody] CreateComplaintDto createComplaintDto)
        {
            await _complaintService.AddComplaintAsync(createComplaintDto);
            return CreatedAtAction(nameof(GetComplaintById), new { id = createComplaintDto }, createComplaintDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComplaint(Guid id, [FromBody] UpdateComplaintDto updateComplaintDto)
        {
            await _complaintService.UpdateComplaintAsync(id, updateComplaintDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComplaint(Guid id)
        {
            await _complaintService.DeleteComplaintAsync(id);
            return NoContent();
        }
    }
}
