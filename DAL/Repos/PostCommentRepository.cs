using DAL.Abstractions;
using DAL.Context;
using DAL.Models;

namespace DAL.Repos
{
    public class PostCommentRepository : GenericRepository<PostComment>, IPostCommentRepository
    {
        public PostCommentRepository(JobNetContext context) : base(context) { }
    }
}
