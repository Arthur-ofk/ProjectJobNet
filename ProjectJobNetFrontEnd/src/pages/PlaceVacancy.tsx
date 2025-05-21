import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store.ts';
import { API_BASE_URL } from '../constants.ts';
import { useNavigate } from 'react-router-dom';
import VacancyForm from '../components/jobs/VacancyForm.tsx';
import './PlaceVacancy.css';

function PlaceVacancy() {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [jobCategories, setJobCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Load categories - switching to regular /categories endpoint
    async function loadCategories() {
      try {
        // Use the general categories endpoint instead of jobcategories
        const res = await fetch(`${API_BASE_URL}/categories`);
        if (!res.ok) throw new Error('Failed to load categories');
        const data = await res.json();
        
        // Map the data to match the expected format for jobCategories
        const formattedCategories = data.map((category: any) => ({
          id: category.id,
          name: category.categoryName || category.name
        }));
        
        setJobCategories(formattedCategories);
      } catch (err: any) {
        console.error('Failed to load categories', err);
        setError(err.message || 'Failed to load job categories');
      }
    }
    
    loadCategories();
  }, [token, navigate]);

  const handleSubmit = async (jobData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          ...jobData,
          userId: user.id,
          status: 'open'
        })
      });
      
      if (!res.ok) throw new Error('Failed to create job vacancy');
      navigate('/vacancies');
    } catch (err: any) {
      setError(err.message || 'Failed to create job vacancy');
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="place-vacancy-container">
      <div className="place-vacancy-header">
        <h2>Place Vacancy</h2>
        <p>Create a new job opening by filling out the form below.</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <VacancyForm
        onSubmit={handleSubmit}
        jobCategories={jobCategories}
        loading={loading}
        buttonText="Place Vacancy"
        onCancel={() => navigate('/vacancies')}
      />
    </div>
  );
}

export default PlaceVacancy;
