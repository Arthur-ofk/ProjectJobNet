using BLL.Services.Abstractins;
using BLL.Shared.BlogPost;
using BLL.Shared.Complaint;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace ProjectJobNet.Controllers
{
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
            _blogPostService = blogPostService ?? throw new ArgumentNullException(nameof(blogPostService));
            _blogPostVoteService = blogPostVoteService ?? throw new ArgumentNullException(nameof(blogPostVoteService));
            _postCommentService = postCommentService ?? throw new ArgumentNullException(nameof(postCommentService));
            _savedBlogPostService = savedBlogPostService ?? throw new ArgumentNullException(nameof(savedBlogPostService));
            _complaintService = complaintService ?? throw new ArgumentNullException(nameof(complaintService));
        }

        // CRUD operations for blog posts
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
        [Authorize]
        public async Task<ActionResult<BlogPostDto>> AddBlogPost([FromForm] CreateBlogPostDto createBlogPostDto)
        {
            var created = await _blogPostService.AddBlogPostAsync(createBlogPostDto);
            return CreatedAtAction(nameof(GetBlogPostById),
                                   new { id = created.Id },
                                   created);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateBlogPost(Guid id, [FromBody] UpdateBlogPostDto updateBlogPostDto)
        {
            await _blogPostService.UpdateBlogPostAsync(id, updateBlogPostDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteBlogPost(Guid id)
        {
            await _blogPostService.DeleteBlogPostAsync(id);
            return NoContent();
        }

        // GET: api/BlogPost/{id}/vote - Get current vote status
        [HttpGet("{id}/vote")]
        [Authorize]
        public async Task<IActionResult> GetVoteStatus(Guid id)
        {
            try
            {
                if (!User.Identity.IsAuthenticated)
                    return Unauthorized();
                
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                    return Unauthorized("User ID not found");
                
                var userId = Guid.Parse(userIdClaim.Value);
                var vote = await _blogPostVoteService.GetUserVoteAsync(id, userId);
                return Ok(new { voted = vote != null, isUpvote = vote?.IsUpvote });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving vote status: {ex.Message}");
            }
        }

        // POST: api/BlogPost/{id}/vote
        [HttpPost("{id}/vote")]
        [Authorize]
        public async Task<IActionResult> Vote(Guid id, [FromBody] VoteRequestDto request)
        {
            try
            {
                // Ensure user is authenticated
                if (!User.Identity.IsAuthenticated)
                {
                    return Unauthorized("User must be authenticated to vote");
                }

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User ID not found in token");
                }
                
                var userId = Guid.Parse(userIdClaim.Value);
                
                // If UserId isn't provided in the request, use the authenticated user
                if (request.UserId == Guid.Empty)
                {
                    request.UserId = userId;
                }
                
                var result = await _blogPostVoteService.VotePostAsync(id, request.UserId, request.IsUpvote);
                if (!result)
                {
                    return BadRequest("Failed to vote. You may have already voted.");
                }
                
                // Calculate and return the current score
                var score = await _blogPostVoteService.GetScoreAsync(id);
                return Ok(new { success = result, isUpvote = request.IsUpvote, score });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error voting: {ex.Message}");
            }
        }

        // POST: api/BlogPost/{id}/vote/remove - Remove a vote
        [HttpPost("{id}/vote/remove")]
        [Authorize]
        public async Task<IActionResult> RemoveVote(Guid id, [FromBody] VoteRequestDto request)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                    return Unauthorized("User ID not found");
                    
                var userId = Guid.Parse(userIdClaim.Value);
                
                // If UserId isn't provided in the request, use the authenticated user
                if (request.UserId == Guid.Empty)
                {
                    request.UserId = userId;
                }
                
                var result = await _blogPostVoteService.RemoveVoteAsync(id, request.UserId);
                if (!result)
                {
                    return BadRequest("Failed to remove vote.");
                }
                
                // Calculate and return the current score
                var score = await _blogPostVoteService.GetScoreAsync(id);
                return Ok(new { success = result, score });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error removing vote: {ex.Message}");
            }
        }

        // DELETE: api/BlogPost/{id}/vote - Remove a vote
        [HttpDelete("{id}/vote")]
        [Authorize]
        public async Task<IActionResult> DeleteVote(Guid id, [FromBody] VoteRequestDto request)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                    return Unauthorized("User ID not found");
                    
                var userId = Guid.Parse(userIdClaim.Value);
                
                // If UserId isn't provided in the request, use the authenticated user
                if (request.UserId == Guid.Empty)
                {
                    request.UserId = userId;
                }
                
                bool result = await _blogPostVoteService.RemoveVoteAsync(id, request.UserId);
                
                // Calculate and return the current score
                var score = await _blogPostVoteService.GetScoreAsync(id);
                return Ok(new { success = result, score });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error removing vote: {ex.Message}");
            }
        }

        // GET: api/BlogPost/{id}/score
        [HttpGet("{id}/score")]
        [AllowAnonymous]
        public async Task<IActionResult> GetScore(Guid id)
        {
            try
            {
                var score = await _blogPostVoteService.GetScoreAsync(id);
                return Ok(new { score });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving score: {ex.Message}");
            }
        }

        // Comment endpoints
        [HttpGet("{id}/comments")]
        [AllowAnonymous]
        public async Task<IActionResult> GetComments(Guid id)
        {
            try
            {
                var comments = await _postCommentService.GetCommentsByPostIdAsync(id);
                return Ok(comments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving comments: {ex.Message}");
            }
        }

        [HttpPost("{id}/comments")]
        [Authorize]
        public async Task<IActionResult> AddComment(Guid id, [FromBody] CreatePostCommentDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                
                // Set PostId from URL if not provided in the body
                if (dto.PostId == Guid.Empty)
                    dto.PostId = id;

                // Get user ID from the token if not provided
                if (dto.UserId == Guid.Empty)
                {
                    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                    if (userIdClaim == null)
                        return Unauthorized("User ID not found");
                    
                    dto.UserId = Guid.Parse(userIdClaim.Value);
                }
                
                var comment = await _postCommentService.AddCommentAsync(dto);
                return Ok(comment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error adding comment: {ex.Message}");
            }
        }

        [HttpDelete("comments/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteComment(Guid id)
        {
            var result = await _postCommentService.DeleteCommentAsync(id);
            if (!result)
                return NotFound();
                
            return NoContent();
        }

        // Save post endpoints
        [HttpPost("{id}/save")]
        [Authorize]
        public async Task<IActionResult> SavePost(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("User ID not found");
                
            var userId = Guid.Parse(userIdClaim.Value);
            var dto = new CreateSavedBlogPostDto { BlogPostId = id, UserId = userId };
            await _savedBlogPostService.AddSavedPostAsync(dto);
            return Ok();
        }

        //[HttpDelete("{id}/save")]
        //[Authorize]
        //public async Task<IActionResult> RemoveSavedPost(Guid id)
        //{
        //    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        //    if (userIdClaim == null)
        //        return Unauthorized("User ID not found");
                
        //    var userId = Guid.Parse(userIdClaim.Value);
        //    await _savedBlogPostService.RemoveSavedPostAsync(userId, id);
        //    return NoContent();
        //}

        // Report post endpoint
        [HttpPost("{id}/report")]
        [Authorize]
        public async Task<IActionResult> ReportPost(Guid id, [FromBody] CreateComplaintDto complaintDto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("User ID not found");
                
            complaintDto.TargetPostId = id;
            complaintDto.ComplainantId = Guid.Parse(userIdClaim.Value);
            await _complaintService.AddComplaintAsync(complaintDto);
            return Ok();
        }

        // Paged posts endpoint
        [HttpGet("paged")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPagedBlogPosts([FromQuery] int skip = 0, [FromQuery] int take = 10)
        {
            var posts = await _blogPostService.GetPagedBlogPostsAsync(skip, take);
            return Ok(posts);
        }

        // Get saved posts endpoint
        [HttpGet("saved")]
        [Authorize]
        public async Task<IActionResult> GetSavedPosts()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                    return Unauthorized("User ID not found in token");
                    
                var userId = Guid.Parse(userIdClaim.Value);
                var saved = await _savedBlogPostService.GetSavedPostsAsync(userId);
                return Ok(saved);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving saved posts: {ex.Message}");
            }
        }

        // Save a post
        [HttpPost("saved")]
        [Authorize]
        public async Task<IActionResult> SavePost([FromBody] CreateSavedBlogPostDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // If UserId isn't provided, use the authenticated user
                if (dto.UserId == Guid.Empty)
                {
                    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                    if (userIdClaim == null)
                        return Unauthorized("User ID not found in token");
                        
                    dto.UserId = Guid.Parse(userIdClaim.Value);
                }
                
                await _savedBlogPostService.AddSavedPostAsync(dto);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error saving post: {ex.Message}");
            }
        }

        // Unsave a post
        [HttpDelete("saved")]
        [Authorize]
        public async Task<IActionResult> RemoveSavedPost([FromQuery] Guid blogPostId)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                    return Unauthorized("User ID not found in token");
                    
                var userId = Guid.Parse(userIdClaim.Value);
                await _savedBlogPostService.RemoveSavedPostAsync(userId, blogPostId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error removing saved post: {ex.Message}");
            }
        }
    }
}
