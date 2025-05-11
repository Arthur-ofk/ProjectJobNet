using AutoMapper;
using BLL.Shared.Subscription;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.MappingProfiles
{
    public class SubscriptionProfile : Profile
    {
        public SubscriptionProfile()
        {
            CreateMap<Subscription, SubscriptionDto>().ReverseMap();
            CreateMap<Subscription, CreateSubscriptionDto>().ReverseMap();
        }
    }
}
