using DAL.Abstractions;
using DAL.Context;
using DAL.Models;
using DAL.Repos;

public class ServiceVoteRepository : GenericRepository<ServiceVote>, IServiceVoteRepository
{
    public ServiceVoteRepository(JobNetContext context) : base(context) { }
}
