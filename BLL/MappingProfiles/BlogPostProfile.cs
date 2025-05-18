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
            // Map BlogPost to BlogPostDto, avoiding circular references
            CreateMap<BlogPost, BlogPostDto>()
                .ForMember(dest => dest.Comments, opt => opt.MapFrom(src => src.Comments.Count))
                .ForMember(dest => dest.Upvotes, opt => opt.MapFrom(src => src.Votes.Count(v => v.IsUpvote)))
                .ForMember(dest => dest.Downvotes, opt => opt.MapFrom(src => src.Votes.Count(v => !v.IsUpvote)));

            // Map for creating BlogPost
            CreateMap<CreateBlogPostDto, BlogPost>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid()))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.Comments, opt => opt.Ignore())
                .ForMember(dest => dest.Votes, opt => opt.Ignore())
                .ForMember(dest => dest.LikedPosts, opt => opt.Ignore())
                .ForMember(dest => dest.Complaints, opt => opt.Ignore())
                .ForMember(dest => dest.SavedPosts, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.ImageData, opt => opt.Ignore()) // Handle separately in service
                .ForMember(dest => dest.ImageContentType, opt => opt.Ignore()); // Handle separately in service
            
            // Map for updating BlogPost
            CreateMap<UpdateBlogPostDto, BlogPost>()
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.Comments, opt => opt.Ignore())
                .ForMember(dest => dest.Votes, opt => opt.Ignore())
                .ForMember(dest => dest.LikedPosts, opt => opt.Ignore())
                .ForMember(dest => dest.Complaints, opt => opt.Ignore())
                .ForMember(dest => dest.SavedPosts, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore());
            
            // Map PostComment to PostCommentDto
            CreateMap<PostComment, PostCommentDto>();
            CreateMap<CreatePostCommentDto, PostComment>();
        }
    }
}
