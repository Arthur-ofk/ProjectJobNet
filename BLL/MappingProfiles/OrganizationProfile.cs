using AutoMapper;
using BLL.Shared.Organization;
using DAL.Models;

namespace BLL.MappingProfiles
{
    public class OrganizationProfile : Profile
    {
        public OrganizationProfile()
        {
            // Organization mappings
            CreateMap<Organization, OrganizationDto>();
            CreateMap<CreateOrganizationDto, Organization>();
            CreateMap<UpdateOrganizationDto, Organization>();
            
            // OrganizationUser mappings
            CreateMap<OrganizationUser, OrganizationUserDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.Username))
                .ForMember(dest => dest.OrganizationName, opt => opt.MapFrom(src => src.Organization.Name));
            
            CreateMap<AddUserToOrganizationDto, OrganizationUser>();
        }
    }
}
