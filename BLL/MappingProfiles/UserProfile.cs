using AutoMapper;
using BLL.Shared.User;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.MappingProfiles
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<User, UserDto>()
                .ForMember(dest => dest.ProfileImageData, opt => opt.MapFrom(src => src.ProfileImageData))
                .ForMember(dest => dest.ProfileImageContentType, opt => opt.MapFrom(src => src.ProfileImageContentType))
                .ForMember(dest => dest.ProfilePictureUrl, opt => opt.MapFrom(src => src.ProfilePictureUrl));
            
            CreateMap<UserDto, User>()
                .ForMember(dest => dest.ProfileImageData, opt => opt.MapFrom(src => src.ProfileImageData))
                .ForMember(dest => dest.ProfileImageContentType, opt => opt.MapFrom(src => src.ProfileImageContentType))
                .ForMember(dest => dest.ProfilePictureUrl, opt => opt.MapFrom(src => src.ProfilePictureUrl));
                
            CreateMap<CreateUserDto, User>();
            CreateMap<UpdateUserDto, User>();
        }
    }
}
