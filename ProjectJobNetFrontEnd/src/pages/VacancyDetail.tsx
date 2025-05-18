import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { API_BASE_URL } from '../constants.ts';

type Vacancy = {
  id: string;
  title: string;
  description: string;
  salary: number;
  location: string;
  categoryId: string;
  userId: string;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
};

function VacancyDetail() {
  const { id } = useParams<{id:string}>();
  const { token, user } = useSelector((s:RootState)=>s.auth);
  const [vacancy, setVacancy] = useState<Vacancy|null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`${API_BASE_URL}/jobs/${id}`)  // Changed from vacancies to jobs
        .then(response => response.json())
        .then(data => setVacancy(data))
        .catch(() => setVacancy(null));
    }
    if (token && user) {
      fetch(`${API_BASE_URL}/SavedJob?employerId=${user.id}&jobId=${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.ok ? r.json() : false)
        .then(setSaved)
        .catch(() => setSaved(false));
    }
  }, [id, token, user]);

  const toggleSave = () => {
    if (!token || !user) return;
    const method = saved ? 'DELETE' : 'POST';
    fetch(`${API_BASE_URL}/SavedJob?employerId=${user.id}&jobId=${id}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type':'application/json' }
    }).then(() => setSaved(!saved));
  };

  if (!vacancy) return <div>Loading...</div>;

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 4px 16px rgba(36,94,160,0.08)' }}>
      <h2>{vacancy.title}</h2>
      <div>
        <b>Author:</b>{' '}
        <Link to={`/users/${vacancy.userId}`}>{vacancy.authorName ?? vacancy.userId}</Link>
      </div>
      <div><b>Location:</b> {vacancy.location}</div>
      <div><b>Salary:</b> ${vacancy.salary}</div>
      <div style={{ marginTop: 16 }}><b>Description:</b> {vacancy.description}</div>
      <div><b>Created:</b> {new Date(vacancy.createdAt).toLocaleString()}</div>
      <div><b>Updated:</b> {new Date(vacancy.updatedAt).toLocaleString()}</div>
      {token && (
        <button onClick={toggleSave} style={{margin:'16px 0',padding:'8px 16px',background:'#eaf4fb',border:'none',borderRadius:8,cursor:'pointer'}}>
          {saved ? '★ Saved' : '☆ Save'}
        </button>
      )}
    </div>
  );
}

export default VacancyDetail;
