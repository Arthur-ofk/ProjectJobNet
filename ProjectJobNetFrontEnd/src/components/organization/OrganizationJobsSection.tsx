import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../constants.ts';
import VacancyForm from '../jobs/VacancyForm.tsx';
import './OrganizationJobsSection.css';
import apiClient from '../../utils/apiClient';

type OrganizationJobsSectionProps = {
  organization: any;
  token: string;
};

const JobList: React.FC<{ jobs: any[]; jobCategories: any[] }> = ({ jobs, jobCategories }) => (
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
);

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
        const response = await apiClient.get(`/jobs/organization/${organization.id}`);
        setJobs(response.data);
      } catch (err) {
        console.error('Error loading jobs:', err);
        setError(err.response?.data?.message || 'Failed to fetch jobs');
      }
    };

    fetchOrganizationJobs();
  }, [organization.id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/jobcategories');
        setJobCategories(response.data);
      } catch (err) {
        console.error('Error loading job categories:', err);
        setError(err.response?.data?.message || 'Failed to fetch job categories');
      }
    };

    fetchCategories();
  }, []);

  const handleCreateJob = async (jobData: any) => {
    setLoading(true);
    setError(null);

    try {
      await apiClient.post('/jobs', {
        ...jobData,
        organizationId: organization.id,
      });

      const response = await apiClient.get(`/jobs/organization/${organization.id}`);
      setJobs(response.data);
      setShowJobForm(false);
    } catch (err) {
      console.error('Error creating job posting:', err);
      setError(err.response?.data?.message || 'Error creating job posting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="organization-jobs-section">
      <div className="section-header">
        <h3>Job Openings</h3>
        <button 
          className="btn btn--primary create-job-btn"
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
        <JobList jobs={jobs} jobCategories={jobCategories} />
      )}
    </div>
  );
};

export default OrganizationJobsSection;