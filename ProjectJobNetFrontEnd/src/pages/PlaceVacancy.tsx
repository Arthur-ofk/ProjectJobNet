import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store.ts';
import { API_BASE_URL } from '../constants.ts';
import { useNavigate } from 'react-router-dom';

function PlaceVacancy() {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', salary: '', location: '' });
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, userId: user.id })
      });
      if (!res.ok) throw new Error('Failed to place vacancy');
      navigate('/vacancies');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
      <h2>Place Vacancy</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required style={{ width: '100%', marginBottom: 12 }} />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required style={{ width: '100%', marginBottom: 12 }} />
        </div>
        <div>
          <label>Salary:</label>
          <input type="number" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} required style={{ width: '100%', marginBottom: 12 }} />
        </div>
        <div>
          <label>Location:</label>
          <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required style={{ width: '100%', marginBottom: 12 }} />
        </div>
        <button type="submit" style={{ borderRadius: 8, padding: '8px 20px', background: '#245ea0', color: '#fff', border: 'none' }}>Place Vacancy</button>
      </form>
    </div>
  );
}

export default PlaceVacancy;
