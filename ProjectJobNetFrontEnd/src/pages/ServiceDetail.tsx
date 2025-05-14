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
  // New state for review submission
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState<number>(1);
  const [reviewText, setReviewText] = useState('');
  // Add new state variable for checking if the user has used (ordered) the service
  const [hasOrdered, setHasOrdered] = useState(false);

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

  useEffect(() => {
    if (user && token && id) {
      fetch(`${API_BASE_URL}/order?serviceId=${id}&customerId=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          // Use a case-insensitive check for finished orders
          if (
            data &&
            Array.isArray(data) &&
            data.some(
              (order: any) =>
                order.status &&
                order.status.toLowerCase() === "finished"
            )
          ) {
            setHasOrdered(true);
          } else {
            setHasOrdered(false);
          }
        })
        .catch(() => setHasOrdered(false));
    }
  }, [id, user, token]);

  useEffect(() => {
    if (user && token && id) {
      fetch(`${API_BASE_URL}/services/${id}/hasUsed?userId=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(hasUsed => {
           setHasOrdered(hasUsed);
        })
        .catch(() => setHasOrdered(false));
    }
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

  // New handler to submit review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token || !service) return;
    const reviewData = {
      authorId: user.id,
      targetId: service.id,
      rating: reviewRating,
      reviewText
    };
    const res = await fetch(`${API_BASE_URL}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(reviewData)
    });
    if (res.ok) {
      // Refresh reviews
      fetch(`${API_BASE_URL}/Review`)
        .then(res => res.json())
        .then(data => {
          setReviews(data.filter((r: Review) => r.targetId === service.id));
          setShowReviewForm(false);
          setReviewRating(1);
          setReviewText('');
        });
    } else {
      alert('Failed to submit review.');
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
              style={{
                marginLeft: 8,
                borderRadius: 8,
                border: 'none',
                background: '#eaf4fb',
                color: '#245ea0',
                padding: '2px 8px',
                cursor: !hasOrdered ? 'not-allowed' : (voteStatus === 'up' ? 'not-allowed' : 'pointer')
              }}
              onClick={() => handleVote(true)}
              disabled={!hasOrdered || voteStatus === 'up'}
            >
              ⬆ Upvote
            </button>
            <button
              style={{
                marginLeft: 8,
                borderRadius: 8,
                border: 'none',
                background: '#ffeaea',
                color: '#b71c1c',
                padding: '2px 8px',
                cursor: !hasOrdered ? 'not-allowed' : (voteStatus === 'down' ? 'not-allowed' : 'pointer')
              }}
              onClick={() => handleVote(false)}
              disabled={!hasOrdered || voteStatus === 'down'}
            >
              ⬇ Downvote
            </button>
          </>
        )}
      </div>
      {user && !hasOrdered && (
        <div style={{ fontSize: '0.9em', color: '#888', marginTop: 4 }}>
          You can vote after you have used the service.
        </div>
      )}
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

      {/* Reviews Section */}
      <h3 style={{ marginTop: 32 }}>Reviews</h3>
      {reviews.length === 0 && <div>No reviews yet.</div>}
      {reviews.map(r => (
        <div key={r.id} style={{ background: '#f5f5f5', borderRadius: 8, padding: 16, marginTop: 12 }}>
          <div><b>Rating:</b> {r.rating}</div>
          <div><b>Review:</b> {r.reviewText}</div>
          <div style={{ fontSize: '0.9em', color: '#888' }}>{new Date(r.createdAt).toLocaleString()}</div>
        </div>
      ))}
      {!showReviewForm && user && (
        <button
          onClick={() => setShowReviewForm(true)}
          style={{
            marginTop: 16,
            borderRadius: 8,
            padding: '8px 16px',
            background: '#008CBA',
            color: '#fff',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Write Review
        </button>
      )}
      {showReviewForm && (
        <form onSubmit={handleSubmitReview} style={{ marginTop: 16, background: '#eaf4fb', padding: 16, borderRadius: 8 }}>
          <div>
            <label style={{ marginRight: 8 }}><b>Rating:</b></label>
            <input
              type="number"
              min="1"
              max="5"
              value={reviewRating}
              onChange={e => setReviewRating(Number(e.target.value))}
              required
              style={{ width: 50, marginRight: 16 }}
            />
          </div>
          <div style={{ marginTop: 8 }}>
            <label style={{ display: 'block', marginBottom: 4 }}><b>Review:</b></label>
            <textarea
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              required
              style={{ width: '100%', height: 80, borderRadius: 8, padding: 8, borderColor: '#ccc' }}
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <button
              type="submit"
              style={{
                marginRight: 8,
                borderRadius: 8,
                padding: '8px 16px',
                background: '#245ea0',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Submit Review
            </button>
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              style={{
                borderRadius: 8,
                padding: '8px 16px',
                background: '#ffeaea',
                color: '#b71c1c',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ServiceDetail;
