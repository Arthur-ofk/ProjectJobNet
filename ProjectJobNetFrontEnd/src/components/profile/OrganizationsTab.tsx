import React, { useState } from 'react';
import { Link } from 'react-router-dom';

type Organization = {
  id: string;
  name: string;
  description: string;
  industry: string;
  website: string;
  address: string;
  logoUrl: string;
  createdAt: string;
  updatedAt: string;
};

type OrganizationsTabProps = {
  organizations: Organization[];
  showCreateOrg: boolean;
  setShowCreateOrg: (show: boolean) => void;
  newOrg: {
    name: string;
    description: string;
    industry: string;
    website: string;
    address: string;
    logoUrl: string;
  };
  setNewOrg: (org: any) => void;
  onCreateOrg: (e: React.FormEvent) => void;
};

const OrganizationsTab: React.FC<OrganizationsTabProps> = ({
  organizations,
  showCreateOrg,
  setShowCreateOrg,
  newOrg,
  setNewOrg,
  onCreateOrg
}) => {
  return (
    <div className="organizations-tab">
      <div className="tab-header">
        <h3>My Organizations</h3>
        <button 
          className="create-org-btn"
          onClick={() => setShowCreateOrg(!showCreateOrg)}
        >
          {showCreateOrg ? 'Cancel' : 'Create Organization'}
        </button>
      </div>

      {showCreateOrg && (
        <form onSubmit={onCreateOrg} className="create-org-form">
          <div className="form-group">
            <label htmlFor="name">Organization Name</label>
            <input
              id="name"
              type="text"
              value={newOrg.name}
              onChange={e => setNewOrg({ ...newOrg, name: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={newOrg.description}
              onChange={e => setNewOrg({ ...newOrg, description: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="industry">Industry</label>
            <input
              id="industry"
              type="text"
              value={newOrg.industry}
              onChange={e => setNewOrg({ ...newOrg, industry: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="url"
              value={newOrg.website}
              onChange={e => setNewOrg({ ...newOrg, website: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              value={newOrg.address}
              onChange={e => setNewOrg({ ...newOrg, address: e.target.value })}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="logoUrl">Logo URL</label>
            <input
              id="logoUrl"
              type="url"
              value={newOrg.logoUrl}
              onChange={e => setNewOrg({ ...newOrg, logoUrl: e.target.value })}
              placeholder="https://example.com/logo.png"
            />
          </div>
          
          <button type="submit" className="submit-btn">
            Create Organization
          </button>
        </form>
      )}

      <div className="organizations-grid">
        {organizations.length === 0 ? (
          <p className="no-orgs">You haven't created any organizations yet.</p>
        ) : (
          organizations.map(org => (
            <Link to={`/organizations/${org.id}`} key={org.id} className="org-card-link">
              <div className="org-card">
                {org.logoUrl && (
                  <img 
                    src={org.logoUrl}
                    alt={org.name}
                    className="org-logo"
                  />
                )}
                <h4>{org.name}</h4>
                <p className="org-industry">{org.industry}</p>
                <p className="org-description">{org.description}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default OrganizationsTab;
