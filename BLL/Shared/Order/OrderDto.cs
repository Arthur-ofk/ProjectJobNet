namespace BLL.Shared.Order
{
    public class OrderDto
    {
        public Guid Id { get; set; }
        public Guid ServiceId { get; set; }
        public Guid AuthorId { get; set; }
        public Guid CustomerId { get; set; }
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
        public string Status { get; set; }  // e.g. "Pending", "Accepted", "Refused", "Confirmed"
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
        public bool AuthorConfirmed { get; set; }
        public bool CustomerConfirmed { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? AcceptedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
        public string Message { get; set; }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
    }
}
