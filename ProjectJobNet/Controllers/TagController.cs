using BLL.Services.Abstractins;
using BLL.Shared.Tag;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ProjectJobNet.Controllers
{
    [Authorize]
    [Route("api/tags")]
    [ApiController]
    public class TagController : ControllerBase
    {
        private readonly ITagService _tagService;

        public TagController(ITagService tagService)
        {
            _tagService = tagService;
        }

        // GET: api/Tag
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TagDto>>> GetAllTags()
        {
            var tags = await _tagService.GetAllTagsAsync();
            return Ok(tags);
        }

        // GET: api/Tag/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TagDto>> GetTagById(Guid id)
        {
            var tag = await _tagService.GetTagByIdAsync(id);
            if (tag == null)
                return NotFound();

            return Ok(tag);
        }

        // POST: api/Tag
        [HttpPost]
        public async Task<IActionResult> AddTag([FromBody] CreateTagDto createTagDto)
        {
            await _tagService.AddTagAsync(createTagDto);
            return CreatedAtAction(nameof(GetTagById), new { id = createTagDto }, createTagDto);
        }

        // PUT: api/Tag/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTag(Guid id, [FromBody] UpdateTagDto updateTagDto)
        {
            await _tagService.UpdateTagAsync(id, updateTagDto);
            return NoContent();
        }

        // DELETE: api/Tag/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTag(Guid id)
        {
            await _tagService.DeleteTagAsync(id);
            return NoContent();
        }
    }
}
