import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_BASE_URL } from '../constants.ts';

type Service = {
  id: number | string;
  title: string;
  description: string;
  providerName: string;
  providerId: string;
  price: number;
  tags?: string[];
  upvotes: number;
  rating?: number;
};

type User = {
  id: string;
  userName: string;
  email?: string;
  // ...other fields as needed
};

function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/services/${id}`)
      .then(res => res.json())
      .then(data => {
        setService(data);
        setLoading(false);
        if (data?.providerId) {
          fetch(`${API_BASE_URL}/users/${data.providerId}`)
            .then(res => res.json())
            .then(user => setAuthor(user));
        }
      });
  }, [id]);

  const handleUpvote = async () => {
    await fetch(`${API_BASE_URL}/services/${id}/upvote`, { method: 'POST' });
    setService(s => s ? { ...s, upvotes: (s.upvotes ?? 0) + 1 } : s);
  };

  if (loading) return <div>Loading...</div>;
  if (!service) return <div>Not found</div>;

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 4px 16px rgba(36,94,160,0.08)' }}>
      <h2>{service.title}</h2>
      <div>
        <b>Provider:</b>{' '}
        {author ? (
          <Link to={`/users/${author.id}`}>{author.userName}</Link>
        ) : (
          <span>{service.providerName}</span>
        )}
      </div>
      <div><b>Price:</b> ${service.price}</div>
      <div><b>Upvotes:</b> {service.upvotes ?? 0} <button onClick={handleUpvote} style={{ marginLeft: 8, borderRadius: 8, border: 'none', background: '#eaf4fb', color: '#245ea0', padding: '2px 8px', cursor: 'pointer' }}>⬆ Upvote</button></div>
      {service.rating !== undefined && <div><b>Rating:</b> {service.rating.toFixed(1)}</div>}
      {service.tags && service.tags.length > 0 && (
        <div><b>Tags:</b> {service.tags.join(', ')}</div>
      )}
      <div style={{ marginTop: 16 }}><b>Description:</b> {service.description}</div>
    </div>
  );
}

export default ServiceDetail;
