import React from 'react';
import './OrganizationInfoTab.css';

interface OrganizationInfoTabProps {
  organization: any;
}

const OrganizationInfoTab: React.FC<OrganizationInfoTabProps> = ({ organization }) => {
  return (
    <div className="org-info">
      <h3>Organization Details</h3>
      <div className="info-display">
        <div className="info-row">
          <div className="info-label">Name</div>
          <div className="info-value">{organization.name}</div>
        </div>
        <div className="info-row">
          <div className="info-label">Industry</div>
          <div className="info-value">{organization.industry || 'Not specified'}</div>
        </div>
        <div className="info-row">
          <div className="info-label">Website</div>
          <div className="info-value">
            {organization.website ? (
              <a href={organization.website} target="_blank" rel="noopener noreferrer">
                {organization.website}
              </a>
            ) : (
              'Not provided'
            )}
          </div>
        </div>
        <div className="info-row">
          <div className="info-label">Address</div>
          <div className="info-value">{organization.address || 'Not provided'}</div>
        </div>
        <div className="info-row">
          <div className="info-label">Created</div>
          <div className="info-value">
            {new Date(organization.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationInfoTab;
