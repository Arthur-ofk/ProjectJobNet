import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store.ts';
import { fetchVacanciesRequest } from '../slices/vacanciesSlice.ts';
import InfoCard from '../components/InfoCard.tsx';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../constants.ts';
import './AllVacancies.css';

type User = {
  id: string;
  userName: string;
};

function AllVacancies() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.vacancies);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState<'title' | 'salary' | 'location' | 'author'>('title');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();

  // NEW Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  // Add state for organizations
  const [orgMap, setOrgMap] = useState<{[userId: string]: string}>({});

  useEffect(() => {
    dispatch(fetchVacanciesRequest());
  }, [dispatch]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/users`)
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        
        // For each user, fetch their organizations
        data.forEach((user: User) => {
          fetch(`${API_BASE_URL}/organization/user/${user.id}`)
            .then(res => res.ok ? res.json() : [])
            .then((orgs: any[]) => {
              if (orgs && orgs.length > 0) {
                setOrgMap(prev => ({
                  ...prev,
                  [user.id]: orgs[0].name
                }));
              }
            })
            .catch(err => console.error(`Failed to load organizations for user ${user.id}:`, err));
        });
      });
  }, []);

  const getUserName = (id: string | number) => {
    const user = users.find(u => u.id === id);
    return user ? user.userName : 'Unknown';
  };

  let filtered = items.filter(v =>
    v.title.toLowerCase().includes(search.toLowerCase()) &&
    (location ? v.location.toLowerCase().includes(location.toLowerCase()) : true)
  );
  filtered = filtered.sort((a, b) => {
    let valA = a[sort];
    let valB = b[sort];
    if (sort === 'author') {
      valA = getUserName(a.userId);
      valB = getUserName(b.userId);
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

  // NEW Pagination: slice filtered items
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="cards-list">
      <h2>All Vacancies</h2>
      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by location..."
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
        <select value={sort} onChange={e => setSort(e.target.value as any)}>
          <option value="title">Sort by Title</option>
          <option value="salary">Sort by Salary</option>
          <option value="location">Sort by Location</option>
          <option value="author">Sort by Author</option>
        </select>
        <button onClick={() => setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))}>
          {sortDir === 'asc' ? 'Asc' : 'Desc'}
        </button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div className="cards-grid">
        {currentItems.map(vacancy => (
          <div
            key={vacancy.id}
            className="card clickable"
            onClick={() => navigate(`/vacancies/${vacancy.id}`)}
            tabIndex={0}
            role="button"
            style={{ cursor: 'pointer' }}
          >
            <InfoCard
              title={vacancy.title}
              subtitle={
                <>
                  <span>
                    Author: <Link to={`/users/${vacancy.userId}`} onClick={e => e.stopPropagation()}>{getUserName(vacancy.userId)}</Link>
                    {orgMap[vacancy.userId] && (
                      <span> ({orgMap[vacancy.userId]})</span>
                    )}
                  </span>
                  <span> | Location: {vacancy.location}</span>
                  <span> | Salary: ${vacancy.salary}</span>
                </>
              }
              description={vacancy.description}
            />
            <div style={{ position: 'absolute', bottom: 8, right: 8 }}>
              {token && user && (
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
                    fetch(`${API_BASE_URL}/savedVacancy`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                      body: JSON.stringify({ vacancyId: vacancy.id, userId: user.id })
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
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

export default AllVacancies;
