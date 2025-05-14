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
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [provider, setProvider] = useState('');
  const [sort, setSort] = useState<'title' | 'price' | 'providerName' | 'upvotes'>('upvotes');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const navigate = useNavigate();

  // NEW Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

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

  // NEW: Pagination slice
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

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
        {currentItems.map((service: Service) => (
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
            <div style={{ position: 'absolute', bottom: 8, right: 8 }}>
              {token && (
                <button 
                  style={{
                    padding: '4px 8px',
                    background: '#eaf4fb',
                    color: '#245ea0',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer'
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    // Call save endpoint; adjust API as needed
                    fetch(`${API_BASE_URL}/savedService`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                      body: JSON.stringify({ serviceId: service.id, userId: user.id })
                    })
                      .then(res => {
                        if (!res.ok) throw new Error('Save failed');
                        alert('Saved!');
                      })
                      .catch(err => alert(err.message));
                  }}
                >
                  Save
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* NEW Pagination Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
        <div>
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
          <span style={{ margin: '0 8px' }}>Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
        </div>
        <div>
          <label>Show&nbsp;
            <select value={itemsPerPage} onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
              <option value={15}>15</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
            &nbsp;per page
          </label>
        </div>
      </div>
    </div>
  );
}

export default AllServices;
