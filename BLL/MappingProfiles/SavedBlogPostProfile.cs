using AutoMapper;
using BLL.Shared.BlogPost;
using DAL.Models;

namespace BLL.MappingProfiles
{
    public class SavedBlogPostProfile : Profile
    {
        public SavedBlogPostProfile()
        {
            CreateMap<SavedBlogPost, SavedBlogPostDto>().ReverseMap();
            CreateMap<CreateSavedBlogPostDto, SavedBlogPost>();
        }
    }
}
