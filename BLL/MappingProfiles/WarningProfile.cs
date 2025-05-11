using AutoMapper;
using BLL.Shared.Warning;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.MappingProfiles
{
    public class WarningProfile : Profile
    {
        public WarningProfile()
        {
            CreateMap<Warning, WarningDto>().ReverseMap();
            CreateMap<CreateWarningDto, Warning>();
        }
    }
}
