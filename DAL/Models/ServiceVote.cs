using System;

public class ServiceVote
{
    public Guid Id { get; set; }
    public Guid ServiceId { get; set; }
    public Guid UserId { get; set; }
    public bool IsUpvote { get; set; }
    public DateTime CreatedAt { get; set; }
}
