import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchVacancies } from '../slices/vacanciesSlice.ts';
import InfoCard from '../components/InfoCard.tsx';
import { useNavigate } from 'react-router-dom';
import './AllVacancies.css';

function AllVacancies() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.vacancies);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState<'title' | 'salary' | 'location'>('title');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchVacancies());
  }, [dispatch]);

  // Filtering and sorting logic
  let filtered = items.filter(v =>
    v.title.toLowerCase().includes(search.toLowerCase()) &&
    (location ? v.location.toLowerCase().includes(location.toLowerCase()) : true)
  );
  filtered = filtered.sort((a, b) => {
    let valA = a[sort];
    let valB = b[sort];
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
        </select>
        <button onClick={() => setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))}>
          {sortDir === 'asc' ? 'Asc' : 'Desc'}
        </button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div className="cards-grid">
        {filtered.map(vacancy => (
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
              subtitle={`Location: ${vacancy.location} | Salary: $${vacancy.salary}`}
              description={vacancy.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllVacancies;
