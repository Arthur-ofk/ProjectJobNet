using System;

public class Order
{
    public Guid Id { get; set; }
    public Guid ServiceId { get; set; }
    public Guid AuthorId { get; set; } 
    public Guid CustomerId { get; set; } 
    public string Status { get; set; } = string.Empty;
    public bool AuthorConfirmed { get; set; }
    public bool CustomerConfirmed { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? AcceptedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string Message { get; set; } = string.Empty;
}
