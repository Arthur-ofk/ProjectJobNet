import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../constants.ts';
import VacancyForm from '../jobs/VacancyForm.tsx';
import './OrganizationJobsSection.css';

type OrganizationJobsSectionProps = {
  organization: any;
  token: string;
};

const OrganizationJobsSection: React.FC<OrganizationJobsSectionProps> = ({
  organization,
  token,
}) => {
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobCategories, setJobCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizationJobs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/jobs/organization/${organization.id}`);
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const data = await response.json();
        setJobs(data);
      } catch (err: any) {
        console.error('Error loading jobs:', err);
      }
    };

    fetchOrganizationJobs();
  }, [organization.id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/jobcategories`);
        if (!response.ok) throw new Error('Failed to fetch job categories');
        const data = await response.json();
        setJobCategories(data);
      } catch (err: any) {
        console.error('Error loading job categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const handleCreateJob = async (jobData: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...jobData,
          organizationId: organization.id,
        })
      });

      if (!response.ok) throw new Error('Failed to create job');

      const fetchOrganizationJobs = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/jobs/organization/${organization.id}`);
          if (!response.ok) throw new Error('Failed to fetch jobs');
          const data = await response.json();
          setJobs(data);
        } catch (err: any) {
          console.error('Error loading jobs:', err);
        }
      };

      fetchOrganizationJobs();
      setShowJobForm(false);
    } catch (err: any) {
      setError(err.message || 'Error creating job posting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="organization-jobs-section">
      <div className="section-header">
        <h3>Job Openings</h3>
        <button 
          className="create-job-btn"
          onClick={() => setShowJobForm(true)}
        >
          Create Job Opening
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showJobForm && (
        <VacancyForm
          onSubmit={handleCreateJob}
          jobCategories={jobCategories}
          loading={loading}
          buttonText="Post Job"
          onCancel={() => setShowJobForm(false)}
          showCancelButton={true}
        />
      )}

      {jobs.length === 0 ? (
        <p className="empty-state">No job openings available.</p>
      ) : (
        <div className="jobs-list">
          {jobs.map(job => (
            <div key={job.id} className="job-item">
              <div className="job-info">
                <h4>{job.title}</h4>
                <p className="job-description">{job.description}</p>
                <p className="job-category">
                  {jobCategories.find(c => c.id === job.categoryId)?.name || 'Uncategorized'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizationJobsSection;