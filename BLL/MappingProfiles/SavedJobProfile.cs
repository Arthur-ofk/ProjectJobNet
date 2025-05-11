using AutoMapper;
using BLL.Shared.SavedJob;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.MappingProfiles
{
    public class SavedJobProfile : Profile
    {
        public SavedJobProfile()
        {
            CreateMap<SavedJob, SavedJobDto>().ReverseMap();
            CreateMap<CreateSavedJobDto, SavedJob>();
        }
    }
}
