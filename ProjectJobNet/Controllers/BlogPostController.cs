using BLL.Services.Abstractins;
using BLL.Shared.BlogPost;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ProjectJobNet.Controllers
{
    [Authorize]
    [Route("api/posts")]
    [ApiController]
    public class BlogPostController : ControllerBase
    {
        private readonly IBlogPostService _blogPostService;

        public BlogPostController(IBlogPostService blogPostService)
        {
            _blogPostService = blogPostService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<BlogPostDto>>> GetAllBlogPosts()
        {
            var blogPosts = await _blogPostService.GetAllBlogPostsAsync();
            return Ok(blogPosts);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<BlogPostDto>> GetBlogPostById(Guid id)
        {
            var blogPost = await _blogPostService.GetBlogPostByIdAsync(id);
            if (blogPost == null)
                return NotFound();

            return Ok(blogPost);
        }

        [HttpPost]
        public async Task<IActionResult> AddBlogPost([FromBody] CreateBlogPostDto createBlogPostDto)
        {
            await _blogPostService.AddBlogPostAsync(createBlogPostDto);
            return CreatedAtAction(nameof(GetBlogPostById), new { id = createBlogPostDto }, createBlogPostDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBlogPost(Guid id, [FromBody] UpdateBlogPostDto updateBlogPostDto)
        {
            await _blogPostService.UpdateBlogPostAsync(id, updateBlogPostDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBlogPost(Guid id)
        {
            await _blogPostService.DeleteBlogPostAsync(id);
            return NoContent();
        }
    }
}
