using AutoMapper;
using BLL.Shared.BlogPost;
using DAL.Models;
using System;

namespace BLL.MappingProfiles
{
    public class PostCommentProfile : Profile
    {
        public PostCommentProfile()
        {
            // Map PostComment entity to PostCommentDto
            CreateMap<PostComment, PostCommentDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.PostId, opt => opt.MapFrom(src => src.BlogPostId)) // Map BlogPostId to PostId
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.Content, opt => opt.MapFrom(src => src.Content))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt));

            // Map CreatePostCommentDto to PostComment entity
            CreateMap<CreatePostCommentDto, PostComment>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid()))
                .ForMember(dest => dest.BlogPostId, opt => opt.MapFrom(src => src.PostId)) // Map PostId to BlogPostId
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.BlogPost, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore());

            // Map UpdatePostCommentDto to PostComment
            CreateMap<UpdatePostCommentDto, PostComment>()
                .ForMember(dest => dest.BlogPost, opt => opt.Ignore());
        }
    }
}
