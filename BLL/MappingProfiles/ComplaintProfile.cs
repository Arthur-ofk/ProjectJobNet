using AutoMapper;
using BLL.Shared.Complaint;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.MappingProfiles
{
    public class ComplaintProfile : Profile
    {
        public ComplaintProfile()
        {
            CreateMap<Complaint, ComplaintDto>().ReverseMap();
            CreateMap<Complaint, CreateComplaintDto>().ReverseMap();
            CreateMap<Complaint, UpdateComplaintDto>().ReverseMap();
        }
    }
}
