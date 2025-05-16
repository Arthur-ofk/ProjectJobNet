using BLL.Services.Abstractins;
using BLL.Shared.BlogPost;
using BLL.Shared.Complaint;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ProjectJobNet.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BlogPostController : ControllerBase
    {
        private readonly IBlogPostService _blogPostService;
        private readonly IBlogPostVoteService _blogPostVoteService;
        private readonly IPostCommentService _postCommentService;
        private readonly ISavedBlogPostService _savedBlogPostService;
        private readonly IComplaintService _complaintService;

        public BlogPostController(
            IBlogPostService blogPostService,
            IBlogPostVoteService blogPostVoteService,
            IPostCommentService postCommentService,
            ISavedBlogPostService savedBlogPostService,
            IComplaintService complaintService)
        {
            _blogPostService = blogPostService;
            _blogPostVoteService = blogPostVoteService;
            _postCommentService = postCommentService;
            _savedBlogPostService = savedBlogPostService;
            _complaintService = complaintService;
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

        // New endpoint: Vote for a blog post
        [HttpPost("{id}/vote")]
        public async Task<IActionResult> VotePost(Guid id, [FromBody] VoteRequestDto voteRequest)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var result = await _blogPostVoteService.VotePostAsync(id, userId, voteRequest.IsUpvote);
            return result ? Ok() : BadRequest("Voting failed.");
        }

        // New endpoint: Get current user's vote for a blog post
        [HttpGet("{id}/vote")]
        public async Task<IActionResult> GetUserVote(Guid id)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var vote = await _blogPostVoteService.GetUserVoteAsync(id, userId);
            return vote != null ? Ok(vote) : NotFound();
        }

        // New endpoint: Get comments for a blog post (publicly available)
        [HttpGet("{id}/comments")]
        [AllowAnonymous]
        public async Task<IActionResult> GetComments(Guid id)
        {
            var comments = await _postCommentService.GetCommentsByPostAsync(id);
            return Ok(comments);
        }

        // New endpoint: Add a comment to a blog post
        [HttpPost("{id}/comments")]
        public async Task<IActionResult> AddComment(Guid id, [FromBody] CreatePostCommentDto commentDto)
        {
            commentDto.BlogPostId = id;
            commentDto.UserId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            await _postCommentService.AddCommentAsync(commentDto);
            return Ok();
        }

        // New endpoint: Update a comment (separate route)
        [HttpPut("/api/comments/{commentId}")]
        public async Task<IActionResult> UpdateComment(Guid commentId, [FromBody] UpdatePostCommentDto updateDto)
        {
            await _postCommentService.UpdateCommentAsync(commentId, updateDto);
            return NoContent();
        }

        // New endpoint: Delete a comment
        [HttpDelete("/api/comments/{commentId}")]
        public async Task<IActionResult> DeleteComment(Guid commentId)
        {
            await _postCommentService.DeleteCommentAsync(commentId);
            return NoContent();
        }

        // New endpoint: Save a blog post
        [HttpPost("{id}/save")]
        public async Task<IActionResult> SavePost(Guid id)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var dto = new CreateSavedBlogPostDto { BlogPostId = id, UserId = userId };
            await _savedBlogPostService.AddSavedPostAsync(dto);
            return Ok();
        }

        // New endpoint: Remove a saved blog post
        [HttpDelete("{id}/save")]
        public async Task<IActionResult> RemoveSavedPost(Guid id)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            await _savedBlogPostService.RemoveSavedPostAsync(userId, id);
            return NoContent();
        }

        // New endpoint: Report a blog post
        [HttpPost("{id}/report")]
        public async Task<IActionResult> ReportPost(Guid id, [FromBody] CreateComplaintDto complaintDto)
        {
            complaintDto.TargetPostId = id;
            complaintDto.ComplainantId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            await _complaintService.AddComplaintAsync(complaintDto);
            return Ok();
        }
    }
}
