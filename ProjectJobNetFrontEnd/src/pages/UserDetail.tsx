import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../constants.ts';

type User = {
  id: string;
  userName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  // ...other fields as needed
};

type Review = {
  targetId: string | undefined;
  id: string;
  rating: number;
  reviewText: string;
  createdAt: string;
};

function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/users/${id}`)
      .then(res => res.json())
      .then(data => setUser(data));
    fetch(`${API_BASE_URL}/review`)
      .then(res => res.json())
      .then(data => {
        setReviews(data.filter((r: Review) => r.targetId === id));
        setLoading(false);
      });
  }, [id]);

  if (loading || !user) return <div>Loading...</div>;

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 600, margin: '0 auto', boxShadow: '0 4px 16px rgba(36,94,160,0.08)' }}>
      <h2>{user.userName}</h2>
      <div><b>Name:</b> {user.firstName} {user.lastName}</div>
      <div><b>Email:</b> {user.email}</div>
      {/* Additional public user info as needed */}
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

export default UserDetail;
