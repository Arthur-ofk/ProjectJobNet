using AutoMapper;
using BLL.Shared.SubscriptionPlan;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.MappingProfiles
{
    public class SubscriptionPlanProfile : Profile
    {
        public SubscriptionPlanProfile()
        {
            CreateMap<SubscriptionPlan, SubscriptionPlanDto>().ReverseMap();
            CreateMap<SubscriptionPlan, CreateSubscriptionPlanDto>().ReverseMap();
        }
    }
}
