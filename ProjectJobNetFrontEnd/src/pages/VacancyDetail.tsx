import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { API_BASE_URL } from '../constants.ts';
import './VacancyDetail.css';

type Vacancy = {
  id: string;
  title: string;
  description: string;
  salary: number;
  location: string;
  categoryId: string;
  userId: string;
  organizationId?: string;
  organizationName?: string;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
  employmentType?: string;
  categoryName?: string;
};

function VacancyDetail() {
  const { id } = useParams<{id:string}>();
  const { token, user } = useSelector((s:RootState)=>s.auth);
  const [vacancy, setVacancy] = useState<Vacancy|null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setLoading(true);
      
      // Fetch job details
      fetch(`${API_BASE_URL}/jobs/${id}`)
        .then(response => {
          if (!response.ok) throw new Error('Failed to load vacancy details');
          return response.json();
        })
        .then(data => {
          setVacancy(data);
          
          // If the job has an organizationId, fetch organization details
          if (data.organizationId) {
            return fetch(`${API_BASE_URL}/Organization/${data.organizationId}`)
              .then(res => {
                if (res.ok) return res.json();
                return null;
              })
              .then(orgData => {
                if (orgData) {
                  setVacancy(prev => prev ? {...prev, organizationName: orgData.name} : prev);
                }
              });
          }
        })
        .catch(err => {
          console.error("Error loading vacancy:", err);
          setError(err.message || 'Failed to load vacancy details');
        })
        .finally(() => setLoading(false));
      
      // Check if user saved this job
      if (token && user) {
        fetch(`${API_BASE_URL}/SavedJob?employerId=${user.id}&jobId=${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(r => r.ok ? r.json() : false)
          .then(setSaved)
          .catch(() => setSaved(false));
      }
    }
  }, [id, token, user]);

  const toggleSave = () => {
    if (!token || !user) {
      navigate('/login');
      return;
    }
    
    if (saved) {
      fetch(`${API_BASE_URL}/SavedJob?employerId=${user.id}&jobId=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          if (response.ok) setSaved(false);
          else console.error("Failed to unsave job");
        });
    } else {
      fetch(`${API_BASE_URL}/SavedJob`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employerId: user.id,
          jobId: id
        })
      })
        .then(response => {
          if (response.ok) setSaved(true);
          else console.error("Failed to save job");
        });
    }
  };

  const handleApply = () => {
    // Placeholder for application functionality
    if (!token) {
      navigate('/login');
      return;
    }
    
    window.alert('Your application has been submitted!');
  };

  if (loading) return (
    <div className="vacancy-detail-container">
      <div className="vacancy-detail-loading">
        <div className="spinner"></div>
        <p>Loading vacancy details...</p>
      </div>
    </div>
  );

  if (error || !vacancy) return (
    <div className="vacancy-detail-container">
      <div className="vacancy-detail-error">
        <h2>Error</h2>
        <p>{error || 'Vacancy not found'}</p>
        <button className="btn btn-secondary" onClick={() => navigate('/vacancies')}>
          Back to Vacancies
        </button>
      </div>
    </div>
  );

  return (
    <div className="vacancy-detail-container">
      <div className="vacancy-detail-card">
        <div className="vacancy-header">
          <h1>{vacancy.title}</h1>
          
          <div className="vacancy-meta">
            <div className="vacancy-meta-item">
              <span className="meta-label">Posted by:</span>
              {vacancy.organizationId ? (
                <Link 
                  to={`/organization/${vacancy.organizationId}`} 
                  className="organization-link"
                >
                  {vacancy.organizationName || vacancy.authorName || 'Organization'}
                </Link>
              ) : (
                <Link to={`/users/${vacancy.userId}`} className="user-link">
                  {vacancy.authorName || 'User'}
                </Link>
              )}
            </div>
            
            <div className="vacancy-meta-item">
              <span className="meta-label">Posted:</span>
              {new Date(vacancy.createdAt).toLocaleDateString()}
            </div>
            
            {vacancy.updatedAt !== vacancy.createdAt && (
              <div className="vacancy-meta-item">
                <span className="meta-label">Updated:</span>
                {new Date(vacancy.updatedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
        
        <div className="vacancy-highlights">
          <div className="highlight">
            <div className="highlight-label">Location</div>
            <div className="highlight-value">{vacancy.location}</div>
          </div>
          
          <div className="highlight">
            <div className="highlight-label">Salary</div>
            <div className="highlight-value">${vacancy.salary.toLocaleString()}</div>
          </div>
          
          {vacancy.employmentType && (
            <div className="highlight">
              <div className="highlight-label">Type</div>
              <div className="highlight-value">{vacancy.employmentType}</div>
            </div>
          )}
          
          {vacancy.categoryName && (
            <div className="highlight">
              <div className="highlight-label">Category</div>
              <div className="highlight-value">{vacancy.categoryName}</div>
            </div>
          )}
        </div>
        
        <div className="vacancy-description">
          <h2>Job Description</h2>
          <p>{vacancy.description}</p>
        </div>
        
        <div className="vacancy-actions">
          <button 
            className="btn btn-primary apply-btn"
            onClick={handleApply}
          >
            Apply Now
          </button>
          
          <button 
            className={`btn ${saved ? 'btn-saved' : 'btn-outline'} save-btn`}
            onClick={toggleSave}
          >
            {saved ? '★ Saved' : '☆ Save Job'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VacancyDetail;
