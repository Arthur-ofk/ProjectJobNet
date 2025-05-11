using AutoMapper;
using BLL.Shared.BlogPost;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.MappingProfiles
{
    public class BlogPostProfile : Profile
    {
        public BlogPostProfile()
        {
            CreateMap<BlogPost, BlogPostDto>().ReverseMap();
            CreateMap<CreateBlogPostDto, BlogPost>();
            CreateMap<UpdateBlogPostDto, BlogPost>();
        }
    }
}
