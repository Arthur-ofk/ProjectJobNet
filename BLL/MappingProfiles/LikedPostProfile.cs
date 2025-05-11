using AutoMapper;
using BLL.Shared.LikedPost;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.MappingProfiles
{
    public class LikedPostProfile : Profile
    {
        public LikedPostProfile()
        {
            CreateMap<LikedPost, LikedPostDto>().ReverseMap();
            CreateMap<CreateLikedPostDto, LikedPost>();
        }
    }
}
