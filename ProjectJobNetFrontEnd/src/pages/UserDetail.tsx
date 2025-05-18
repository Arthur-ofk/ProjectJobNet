import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_BASE_URL } from '../constants.ts';
import InfoCard from '../components/InfoCard.tsx';
import './UserDetail.css';

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
  const { id } = useParams<{id:string}>();
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'about'|'services'|'blog'>('about');
  const [services, setServices] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);

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

  useEffect(() => {
    if (tab==='services') {
      fetch(`${API_BASE_URL}/services`)
        .then(r=>r.json())
        .then((all:any[])=> setServices(all.filter(s=>s.userId===id)))
        .catch(()=>setServices([]));
    }
    if (tab==='blog') {
      fetch(`${API_BASE_URL}/BlogPost`)
        .then(r=>r.json())
        .then((all:any[])=> setPosts(all.filter(p=>p.userId===id)))
        .catch(()=>setPosts([]));
    }
  }, [tab, id]);

  if (loading || !user) return <div>Loading...</div>;

  return (
    <div className="user-detail-container">
      <div className="user-header">
        <img src={`https://i.pravatar.cc/80?u=${id}`} alt="avatar" />
        <h2>{user.userName}</h2>
      </div>
      <div className="user-tabs">
        {(['about','services','blog'] as const).map(t=>(
          <button
            key={t}
            className={tab===t?'active':''}
            onClick={()=>setTab(t)}
          >{t.charAt(0).toUpperCase()+t.slice(1)}</button>
        ))}
      </div>
      <div className="user-tab-content">
        {tab==='about' && (
          <div className="about-section">
            <p><b>Name:</b> {user.firstName} {user.lastName}</p>
            <p><b>Email:</b> {user.email}</p>
            {/* add more fields as desired */}
          </div>
        )}
        {tab==='services' && (
          <div className="cards-grid">
            {services.map(s=>(
              <InfoCard
                key={s.id}
                title={s.serviceName}
                subtitle={`Price $${s.price}`}
                description={s.description}
                className="clickable"
                onClick={()=>window.location.href=`/services/${s.id}`}
              />
            ))}
            {services.length===0 && <p>No services.</p>}
          </div>
        )}
        {tab==='blog' && (
          <div className="cards-grid">
            {posts.map(p=>(
              <InfoCard
                key={p.id}
                title={p.title}
                subtitle={new Date(p.createdAt).toLocaleDateString()}
                description={p.content.slice(0,100)+'…'}
                className="clickable"
                onClick={()=>window.location.href=`/posts/${p.id}`}
              />
            ))}
            {posts.length===0 && <p>No blog posts.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDetail;
