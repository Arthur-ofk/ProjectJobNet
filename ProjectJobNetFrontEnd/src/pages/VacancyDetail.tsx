import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { API_BASE_URL } from '../constants.ts';
import './VacancyDetail.css';
import apiClient from '../utils/apiClient.ts';

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
    const fetchVacancyDetails = async () => {
      try {
        setLoading(true);
        const vacancyResponse = await apiClient.get(`/jobs/${id}`);
        const vacancyData = vacancyResponse.data;
        setVacancy(vacancyData);

        if (vacancyData.organizationId) {
          const orgResponse = await apiClient.get(`/Organization/${vacancyData.organizationId}`);
          setVacancy(prev => prev ? { ...prev, organizationName: orgResponse.data.name } : prev);
        }

        if (token && user) {
          const savedResponse = await apiClient.get(`/SavedJob?employerId=${user.id}&jobId=${id}`);
          setSaved(!!savedResponse.data);
        }
      } catch (err) {
        console.error("Error loading vacancy:", err);
        setError(err.response?.data?.message || 'Failed to load vacancy details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchVacancyDetails();
  }, [id, token, user]);

  const toggleSave = async () => {
    if (!token || !user) {
      navigate('/login');
      return;
    }

    try {
      if (saved) {
        await apiClient.delete(`/SavedJob?employerId=${user.id}&jobId=${id}`);
        setSaved(false);
      } else {
        await apiClient.post(`/SavedJob`, { employerId: user.id, jobId: id });
        setSaved(true);
      }
    } catch (err) {
      console.error("Error toggling save state:", err);
    }
  };

  const handleApply = () => {
    if (!token) {
      navigate('/login');
      return;
    }

    window.alert('Your application has been submitted!');
  };

  return (
    <div className="vacancy-detail-container">
      {loading ? (
        <div className="vacancy-detail-loading">
          <div className="spinner"></div>
          <p>Loading vacancy details...</p>
        </div>
      ) : error || !vacancy ? (
        <div className="vacancy-detail-error">
          <h2>Error</h2>
          <p>{error || 'Vacancy not found'}</p>
          <button className="btn btn--outline" onClick={() => navigate('/vacancies')}>
            Back to Vacancies
          </button>
        </div>
      ) : (
        <div className="vacancy-detail-card">
          <div className="vacancy-header">
            <h1>{vacancy.title}</h1>
            <div className="vacancy-meta">
              <div className="vacancy-meta-item">
                <span className="meta-label">Posted by:</span>
                {vacancy.organizationId ? (
                  <Link to={`/organization/${vacancy.organizationId}`} className="organization-link">
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
            <button className="btn btn--primary apply-btn" onClick={handleApply}>
              Apply Now
            </button>
            <button className={`btn ${saved ? 'btn--primary' : 'btn--outline'} save-btn`} onClick={toggleSave}>
              {saved ? '★ Saved' : '☆ Save Job'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VacancyDetail;
