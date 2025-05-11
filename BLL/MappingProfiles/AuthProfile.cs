using AutoMapper;
using BLL.Shared.Auth;
using BLL.Shared.User;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.MappingProfiles
{
    public class AuthProfile : Profile
    {
        public AuthProfile()
        {
            
            CreateMap<RegisterDto, User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore()); 

            
            CreateMap<User, AuthResponseDTO>()
                .ForMember(dest => dest.token, opt => opt.Ignore()); 

            
            CreateMap<User, UserDto>();
        }
    }
}
