import React from 'react';
import { Link } from 'react-router-dom';
import './OrganizationJobsTab.css';

interface OrganizationJobsTabProps {
  jobs: any[];
  canEdit: boolean;
}

const OrganizationJobsTab: React.FC<OrganizationJobsTabProps> = ({ jobs, canEdit }) => {
  return (
    <div className="org-jobs">
      <h3>Organization Jobs</h3>
      {canEdit && (
        <Link to="/createVacancy" className="btn btn--primary create-btn">
          Post New Job
        </Link>
      )}
      <div className="jobs-list">
        {jobs.length === 0 ? (
          <p>No jobs posted by this organization.</p>
        ) : (
          <div className="cards-grid">
            {jobs.map((job: any) => (
              <Link to={`/vacancies/${job.id}`} key={job.id} className="job-card card clickable">
                <h4>{job.title}</h4>
                <div className="subtitle">
                  <span>Location: {job.location}</span>
                  <span> | Salary: ${job.salary}</span>
                </div>
                <div className="desc">{job.description.substring(0, 150)}...</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationJobsTab;
