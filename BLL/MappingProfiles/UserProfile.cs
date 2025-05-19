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
            // Update the User to UserDto mapping to explicitly handle profile image properties
            CreateMap<User, UserDto>()
                .ForMember(dest => dest.ProfileImageData, opt => opt.MapFrom(src => src.ProfileImageData))
                .ForMember(dest => dest.ProfileImageContentType, opt => opt.MapFrom(src => src.ProfileImageContentType))
                .ForMember(dest => dest.ProfilePictureUrl, opt => opt.MapFrom(src => src.ProfilePictureUrl));
            
            // Ensure the reverse mapping is properly configured
            CreateMap<UserDto, User>()
                .ForMember(dest => dest.ProfileImageData, opt => opt.MapFrom(src => src.ProfileImageData))
                .ForMember(dest => dest.ProfileImageContentType, opt => opt.MapFrom(src => src.ProfileImageContentType))
                .ForMember(dest => dest.ProfilePictureUrl, opt => opt.MapFrom(src => src.ProfilePictureUrl));
                
            CreateMap<CreateUserDto, User>();
            CreateMap<UpdateUserDto, User>();
        }
    }
}
