using AutoMapper;
using BLL.Shared.BlogPost;
using DAL.Models;

namespace BLL.MappingProfiles
{
    public class PostCommentProfile : Profile
    {
        public PostCommentProfile()
        {
            CreateMap<PostComment, PostCommentDto>().ReverseMap();
            CreateMap<CreatePostCommentDto, PostComment>();
            CreateMap<UpdatePostCommentDto, PostComment>();
        }
    }
}
