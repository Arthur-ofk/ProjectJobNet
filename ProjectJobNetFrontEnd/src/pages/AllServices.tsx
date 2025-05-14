import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store.ts';
// Update imports from servicesSlice accordingly
import { fetchServicesRequest, upvoteServiceRequested, Service } from '../slices/servicesSlice.ts';
import InfoCard from '../components/InfoCard.tsx';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../constants.ts';
import './AllServices.css';

type User = {
  id: string;
  userName: string;
};

function AllServices() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.services);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [provider, setProvider] = useState('');
  const [sort, setSort] = useState<'title' | 'price' | 'providerName' | 'upvotes'>('upvotes');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchServicesRequest());
  }, [dispatch]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/users`)
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const getUserName = (id: string | number) => {
    const user = users.find(u => u.id === id);
    return user ? user.userName : 'Unknown';
  };

  let filtered = items.filter(s =>
    (s.title?.toLowerCase() ?? '').includes(search.toLowerCase()) &&
    (provider ? (getUserName(s.providerId)?.toLowerCase() ?? '').includes(provider.toLowerCase()) : true)
  );
  filtered = filtered.sort((a, b) => {
    let valA = a[sort] ?? '';
    let valB = b[sort] ?? '';
    if (sort === 'providerName') {
      valA = getUserName(a.providerId);
      valB = getUserName(b.providerId);
    }
    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDir === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDir === 'asc' ? valA - valB : valB - valA;
    }
    return 0;
  });

  return (
    <div className="cards-list">
      <h2>All Services</h2>
      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by provider..."
          value={provider}
          onChange={e => setProvider(e.target.value)}
        />
        <select value={sort} onChange={e => setSort(e.target.value as any)}>
          <option value="upvotes">Sort by Upvotes</option>
          <option value="title">Sort by Title</option>
          <option value="price">Sort by Price</option>
          <option value="providerName">Sort by Provider</option>
        </select>
        <button onClick={() => setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))}>
          {sortDir === 'asc' ? 'Asc' : 'Desc'}
        </button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div className="cards-grid">
        {filtered.map((service: Service) => (
          <div
            key={service.id}
            className="card clickable"
            tabIndex={0}
            role="button"
            style={{ cursor: 'pointer', position: 'relative' }}
            onClick={e => {
              if ((e.target as HTMLElement).closest('.upvote-btn')) return;
              navigate(`/services/${service.id}`);
            }}
          >
            <InfoCard
              title={service.title}
              subtitle={
                <>
                  <span>
                    Author: <Link to={`/users/${service.providerId}`} onClick={e => e.stopPropagation()}>{getUserName(service.providerId)}</Link>
                  </span>
                  <span> | Price: ${service.price}</span>
                </>
              }
              description={service.description}
            />
            <button
              className="upvote-btn"
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                borderRadius: 8,
                border: 'none',
                background: '#eaf4fb',
                color: '#245ea0',
                padding: '4px 10px',
                cursor: 'pointer',
                fontWeight: 600,
                zIndex: 2
              }}
              onClick={e => {
                e.stopPropagation();
                dispatch(upvoteServiceRequested(service.id));
              }}
              title="Upvote"
            >
              ⬆ {(service.upvotes ?? 0) - (service.downvotes ?? 0)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllServices;
