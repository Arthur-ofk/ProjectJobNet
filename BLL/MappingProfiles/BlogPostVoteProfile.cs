using AutoMapper;
using BLL.Shared.BlogPost;
using DAL.Models;

namespace BLL.MappingProfiles
{
    public class BlogPostVoteProfile : Profile
    {
        public BlogPostVoteProfile()
        {
            CreateMap<BlogPostVote, BlogPostVoteDto>().ReverseMap();
        }
    }
}
