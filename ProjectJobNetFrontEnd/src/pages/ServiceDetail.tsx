import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_BASE_URL } from '../constants.ts';
import { useSelector } from 'react-redux';
import { RootState } from '../store.ts';
import './ServiceDetail.css';

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

const StarRating: React.FC<{ value: number; onChange: (val: number) => void }> = ({ value, onChange }) => {
  const stars = [1,2,3,4,5];
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {stars.map(star => (
        <span key={star} 
              style={{ cursor: 'pointer', fontSize: '1.5rem', color: star <= value ? '#ffb400' : '#ccc' }}
              onClick={() => onChange(star)}>
          ★
        </span>
      ))}
    </div>
  );
};

function ServiceDetail() {
  const { id } = useParams<{id:string}>();
  const { token, user } = useSelector((s:RootState)=>s.auth);
  const [service, setService] = useState<Service | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [voteStatus, setVoteStatus] = useState<'none' | 'up' | 'down'>('none');
  const [error, setError] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState<number>(1);
  const [reviewText, setReviewText] = useState('');
  const [hasOrdered, setHasOrdered] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/services/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch service details: ${res.status}`);
        }
        return res.text(); // Read as text first
      })
      .then(text => {
        if (text) {
          const data = JSON.parse(text); // Parse only if text is not empty
          setService(data);
          setLoading(false);
          if (data?.userId) {
            fetch(`${API_BASE_URL}/users/${data.userId}`)
              .then(res => {
                if (!res.ok) {
                  throw new Error(`Failed to fetch user details: ${res.status}`);
                }
                return res.text();
              })
              .then(userText => {
                if (userText) {
                  const user = JSON.parse(userText);
                  setAuthor(user);
                }
              })
              .catch(err => console.error(err));
          }
        } else {
          setLoading(false);
          console.error('Service details response was empty.');
        }
      })
      .catch(err => {
        setLoading(false);
        console.error('Error fetching service details:', err);
      });

    if (user && token && id) {
      fetch(`${API_BASE_URL}/ServiceVote?serviceId=${id}&userId=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.text() : null)
        .then(voteText => {
          if (voteText) {
            const vote = JSON.parse(voteText);
            if (vote && vote.voted && vote.isUpvote === true) setVoteStatus('up');
            else if (vote && vote.voted && vote.isUpvote === false) setVoteStatus('down');
            else setVoteStatus('none');
          }
        })
        .catch(err => console.error('Error fetching vote status:', err));
    }

    fetch(`${API_BASE_URL}/reviews?targetId=${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch reviews: ${res.status}`);
        }
        return res.text();
      })
      .then(text => {
        if (text) {
          const data = JSON.parse(text);
          setReviews(data);
        }
      })
      .catch(err => console.error('Error fetching reviews:', err));

    if (token && user) {
      fetch(`${API_BASE_URL}/Order/author/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`Failed to fetch orders: ${res.status}`);
          }
          return res.text();
        })
        .then(text => {
          if (text) {
            const data = JSON.parse(text);
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
        .then(res => {
          if (!res.ok) {
            throw new Error(`Failed to fetch usage status: ${res.statusText}`);
          }
          return res.json();
        })
        .then(hasUsed => {
          setHasOrdered(hasUsed);
        })
        .catch(() => setHasOrdered(false));
    }
  }, [id, user, token]);

  const handleVote = async (isUpvote: boolean) => {
    if (!token) return;
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE_URL}/services/${id}/vote`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(isUpvote)
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          setError('Your session has expired. Please login again.');
        } else {
          setError('You can only vote once and only if you used the service.');
        }
        return;
      }
      
      setVoteStatus(isUpvote ? 'up' : 'down');
      
      if (service) {
        if (isUpvote) {
          service.upvotes = (service.upvotes || 0) + 1;
        } else {
          service.downvotes = (service.downvotes || 0) + 1;
        }
        setService({...service});
      }
      
      fetch(`${API_BASE_URL}/services/${id}`)
        .then(res => res.json())
        .then(data => setService(data));
    } catch (err) {
      console.error("Voting error:", err);
      setError('An error occurred while voting.');
    }
  };

  const handleReport = () => {
    alert('Report functionality is not implemented yet.');
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

  const toggleSave = () => {
    if (!token || !user) return;
    const method = saved ? 'DELETE' : 'POST';
    fetch(`${API_BASE_URL}/services/${id}/save`, {
      method,
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => setSaved(!saved));
  };

  if (loading) return <div>Loading...</div>;
  if (!service) return <div>Not found</div>;

  return (
    <div className="service-detail-container">
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
                cursor: hasOrdered ? 'pointer' : 'not-allowed'
              }}
              onClick={() => handleVote(true)}
              disabled={!hasOrdered || voteStatus !== 'none'}
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
                cursor: hasOrdered ? 'pointer' : 'not-allowed'
              }}
              onClick={() => handleVote(false)}
              disabled={!hasOrdered || voteStatus !== 'none'}
            >
              ⬇ Downvote
            </button>
            <button
              style={{ marginLeft: 8, borderRadius: 8, border: 'none', background: '#ccc', color: '#333', padding: '4px 12px', cursor: 'pointer' }}
              onClick={handleReport}
              title="Report Service"
            >
              Report
            </button>
            <button
              style={{ marginLeft: 8, borderRadius: 8, border: 'none', background: '#ccc', color: '#333', padding: '4px 12px', cursor: 'pointer' }}
              onClick={toggleSave}
            >
              {saved ? '★ Saved' : '☆ Save'}
            </button>
          </>
        )}
      </div>
      {user && hasOrdered && voteStatus !== 'none' && (
        <div style={{ marginTop: 8, fontWeight: 600 }}>
          You voted: {voteStatus === 'up' ? 'Upvoted' : 'Downvoted'}
        </div>
      )}
      {user && !hasOrdered && (
        <div style={{ fontSize: '0.9em', color: '#888', marginTop: 4 }}>
          You can vote after you have used the service.
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      <div style={{ marginTop: 16 }}><b>Description:</b> {service.description}</div>
      {service.categoryId && (
        <div style={{ marginTop: 8 }}>
          <b>Category:</b> {service.categoryId}
        </div>
      )}
      {user && user.id !== service.userId && (
        <button
          style={{ marginTop: 16, borderRadius: 8, padding: '8px 20px', background: '#245ea0', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
          onClick={handlePlaceOrder}
        >
          Place Order
        </button>
      )}
      {orderStatus && <div style={{ marginTop: 8, color: '#245ea0' }}>{orderStatus}</div>}

      {user && (
        <div style={{ marginTop: 32, padding: 16, background: '#eaf4fb', borderRadius: 8 }}>
          <h3>Write a Review</h3>
          <div style={{ marginBottom: 8 }}>
            <StarRating value={reviewRating} onChange={setReviewRating} />
          </div>
          <textarea
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
            placeholder="Write your review..."
            style={{ width: '100%', height: 80, borderRadius: 8, padding: 8, borderColor: '#ccc' }}
          />
          <div style={{ marginTop: 8 }}>
            <button
              onClick={handleSubmitReview}
              style={{ borderRadius: 8, padding: '8px 16px', background: '#245ea0', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
            >
              Submit Review
            </button>
          </div>
        </div>
      )}
      <h3 style={{ marginTop: 32 }}>Comments</h3>
      <div className="comment-list">
        {reviews.length === 0 && <div>No reviews yet.</div>}
        {reviews.map(r => (
          <div key={r.id} className="comment-item">
            <div className="comment-avatar">
              <img
                src={`https://i.pravatar.cc/40?u=${r.authorId}`}
                alt="avatar"
              />
            </div>
            <div className="comment-content">
              <div className="comment-header">
                <a href={`/users/${r.authorId}`} className="comment-username">
                  {reviews.find(u=>u.authorId===r.authorId)?.authorId ?? 'User'}
                </a>
                <span className="comment-date">
                  {new Date(r.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="comment-text">{r.reviewText}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServiceDetail;
