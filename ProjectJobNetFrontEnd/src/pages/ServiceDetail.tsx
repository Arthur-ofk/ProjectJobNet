import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_BASE_URL } from '../constants.ts';
import { useSelector } from 'react-redux';
import { RootState } from '../store.ts';

type Service = {
  id: string;
  serviceName: string;
  description: string;
  price: number;
  upvotes: number;
  downvotes: number;
  userId: string;
  categoryId: string;
};

type User = {
  id: string;
  userName: string;
};

type Order = {
  id: string;
  serviceId: string;
  authorId: string;
  customerId: string;
  status: string;
  createdAt: string;
};

type Review = {
  id: string;
  authorId: string;
  targetId: string;
  rating: number;
  reviewText: string;
  createdAt: string;
};

function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [voteStatus, setVoteStatus] = useState<'none' | 'up' | 'down'>('none');
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/services/${id}`)
      .then(res => res.json())
      .then(data => {
        setService(data);
        setLoading(false);
        if (data?.userId) {
          fetch(`${API_BASE_URL}/users/${data.userId}`)
            .then(res => res.json())
            .then(user => setAuthor(user));
        }
      });
    // Fetch vote status for this user/service
    if (user && token && id) {
      fetch(`${API_BASE_URL}/services/voteStatus?serviceId=${id}&userId=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then(vote => {
          if (vote && vote.voted && vote.isUpvote === true) setVoteStatus('up');
          else if (vote && vote.voted && vote.isUpvote === false) setVoteStatus('down');
          else setVoteStatus('none');
        });
    }
    fetch(`${API_BASE_URL}/Review`)
      .then(res => res.json())
      .then(data => {
        setReviews(data.filter((r: Review) => r.targetId === id));
      });
  }, [id, user, token]);

  const handleVote = async (isUpvote: boolean) => {
    if (!token) return;
    setError(null);
    const res = await fetch(`${API_BASE_URL}/services/${id}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(isUpvote)
    });
    if (!res.ok) {
      setError('You can only vote once and only if you used the service.');
      return;
    }
    setVoteStatus(isUpvote ? 'up' : 'down');
    // Optionally, refresh service data
    fetch(`${API_BASE_URL}/services/${id}`)
      .then(res => res.json())
      .then(data => setService(data));
  };

  const handlePlaceOrder = async () => {
    if (!user || !token || !service) return;
    const res = await fetch(`${API_BASE_URL}/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        serviceId: service.id,
        customerId: user.id,
        message: ''
      })
    });
    if (res.ok) {
      setOrderStatus('Order placed! Wait for author response.');
    } else {
      setOrderStatus('Failed to place order.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!service) return <div>Not found</div>;

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 4px 16px rgba(36,94,160,0.08)' }}>
      <h2>{service.serviceName}</h2>
      <div>
        <b>Author:</b>{' '}
        {author ? (
          <Link to={`/users/${author.id}`}>{author.userName}</Link>
        ) : (
          <span>{service.userId}</span>
        )}
      </div>
      <div><b>Price:</b> ${service.price}</div>
      <div>
        <b>Upvotes:</b> {(service.upvotes ?? 0) - (service.downvotes ?? 0)}
        {user && (
          <>
            <button
              style={{ marginLeft: 8, borderRadius: 8, border: 'none', background: '#eaf4fb', color: '#245ea0', padding: '2px 8px', cursor: voteStatus === 'up' ? 'not-allowed' : 'pointer' }}
              onClick={() => handleVote(true)}
              disabled={voteStatus === 'up'}
            >
              ⬆ Upvote
            </button>
            <button
              style={{ marginLeft: 8, borderRadius: 8, border: 'none', background: '#ffeaea', color: '#b71c1c', padding: '2px 8px', cursor: voteStatus === 'down' ? 'not-allowed' : 'pointer' }}
              onClick={() => handleVote(false)}
              disabled={voteStatus === 'down'}
            >
              ⬇ Downvote
            </button>
          </>
        )}
      </div>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      <div style={{ marginTop: 16 }}><b>Description:</b> {service.description}</div>
      {user && user.id !== service.userId && (
        <button
          style={{ marginTop: 16, borderRadius: 8, padding: '8px 20px', background: '#245ea0', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
          onClick={handlePlaceOrder}
        >
          Place Order
        </button>
      )}
      {orderStatus && <div style={{ marginTop: 8, color: '#245ea0' }}>{orderStatus}</div>}
      <h3 style={{ marginTop: 32 }}>Reviews</h3>
      {reviews.length === 0 && <div>No reviews yet.</div>}
      {reviews.map(r => (
        <div key={r.id} style={{ background: '#f5f5f5', borderRadius: 8, padding: 16, marginTop: 12 }}>
          <div><b>Rating:</b> {r.rating}</div>
          <div><b>Review:</b> {r.reviewText}</div>
          <div style={{ fontSize: '0.9em', color: '#888' }}>{new Date(r.createdAt).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}

export default ServiceDetail;
