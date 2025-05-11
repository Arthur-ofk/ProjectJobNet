using AutoMapper;
using BLL.Shared.Resume;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.MappingProfiles
{
    public class ResumeProfile : Profile
    {
        public ResumeProfile()
        {
            CreateMap<Resume, ResumeDto>().ReverseMap();
            CreateMap<Resume, CreateResumeDto>().ReverseMap();
        }
        
    }
}
