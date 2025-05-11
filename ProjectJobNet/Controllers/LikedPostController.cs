using BLL.Services.Abstractins;
using BLL.Shared.LikedPost;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ProjectJobNet.Controllers
{
    [Authorize]
    [Route("api/likedposts")]
    [ApiController]
    public class LikedPostController : ControllerBase
    {
        private readonly ILikedPostService _likedPostService;

        public LikedPostController(ILikedPostService likedPostService)
        {
            _likedPostService = likedPostService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LikedPostDto>>> GetAllLikedPosts()
        {
            var likedPosts = await _likedPostService.GetAllLikedPostsAsync();
            return Ok(likedPosts);
        }

        [HttpPost]
        public async Task<IActionResult> AddLikedPost([FromBody] CreateLikedPostDto createLikedPostDto)
        {
            await _likedPostService.AddLikedPostAsync(createLikedPostDto);
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> RemoveLikedPost(Guid userId, Guid postId)
        {
            await _likedPostService.RemoveLikedPostAsync(userId, postId);
            return NoContent();
        }
    }
}
