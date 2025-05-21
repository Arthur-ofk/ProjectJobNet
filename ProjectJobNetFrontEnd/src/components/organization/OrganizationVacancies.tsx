import React, { useEffect, useState } from 'react';
import InfoCard from '../InfoCard.tsx';
import { Link } from 'react-router-dom';
import apiClient from '../../utils/apiClient';
import './OrganizationVacancies.css';

type Vacancy = {
  id: string;
  title: string;
  description: string;
  salary: number;
  location: string;
  userId: string;
};

type OrganizationVacanciesProps = {
  orgId: string;
  token: string | null;
};

const OrganizationVacancies: React.FC<OrganizationVacanciesProps> = ({ orgId, token }) => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orgId) return;

    setLoading(true);
    setError(null);

    apiClient.get(`/jobs/organization/${orgId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    })
      .then(res => {
        setVacancies(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading organization vacancies:", err);
        setError(err.response?.data?.message || "Failed to load vacancies");
        setVacancies([]);
        setLoading(false);
      });
  }, [orgId, token]);

  if (loading) return <div className="loading">Loading vacancies...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="org-vacancies">
      <h3>Vacancies</h3>
      
      <Link to={`/createVacancy?orgId=${orgId}`} className="btn btn--primary add-button">
        Add New Vacancy
      </Link>
      
      {vacancies.length === 0 ? (
        <p className="empty-state">No vacancies yet. Add a vacancy to get started.</p>
      ) : (
        <div className="vacancies-grid">
          {vacancies.map(vacancy => (
            <Link to={`/vacancies/${vacancy.id}`} key={vacancy.id} className="vacancy-link">
              <InfoCard
                title={vacancy.title}
                subtitle={`Location: ${vacancy.location} | Salary: $${vacancy.salary}`}
                description={vacancy.description}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizationVacancies;
