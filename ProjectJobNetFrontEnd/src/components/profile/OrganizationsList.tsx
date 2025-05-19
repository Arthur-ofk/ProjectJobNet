import React, { useState } from 'react';
import { API_BASE_URL } from '../../constants.ts';
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

type OrganizationsListProps = {
  organizations: Organization[];
  token: string | null;
  userId: string;
  onOrganizationCreate: (org: Organization) => void;
  onOrganizationSelect: (org: Organization) => void;
};

const OrganizationsList: React.FC<OrganizationsListProps> = ({
  organizations,
  token,
  userId,
  onOrganizationCreate,
  onOrganizationSelect,
}) => {
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [newOrg, setNewOrg] = useState({
    name: '',
    description: '',
    industry: '',
    website: '',
    address: '',
    logoUrl: ''
  });

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("You must be logged in to create an organization");
      return;
    }
  
    try {
      const requestData = {
        ...newOrg,
        ownerUserId: userId
      };
  
      const res = await fetch(`${API_BASE_URL}/organization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });
  
      if (!res.ok) {
        throw new Error(`Failed to create organization: ${res.status}`);
      }
  
      const created = await res.json();
      
      onOrganizationCreate(created);
      setShowCreateOrg(false);
      setNewOrg({
        name: '',
        description: '',
        industry: '',
        website: '',
        address: '',
        logoUrl: ''
      });
    } catch (err: any) {
      console.error("Error creating organization:", err);
      alert(`Failed to create organization: ${err.message}`);
    }
  };

  return (
    <div className="organizations-section">
      <div className="section-header">
        <h3>Your Organizations</h3>
        <button 
          onClick={() => setShowCreateOrg(!showCreateOrg)}
          className="action-button"
        >
          {showCreateOrg ? 'Cancel' : 'Create Organization'}
        </button>
      </div>

      {showCreateOrg && (
        <form onSubmit={handleCreateOrg} className="create-org-form">
          <h4>Create New Organization</h4>
          <div className="form-group">
            <label>Name:</label>
            <input 
              type="text" 
              value={newOrg.name}
              onChange={e => setNewOrg({...newOrg, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Industry:</label>
            <input 
              type="text" 
              value={newOrg.industry}
              onChange={e => setNewOrg({...newOrg, industry: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea 
              value={newOrg.description}
              onChange={e => setNewOrg({...newOrg, description: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Website:</label>
            <input 
              type="url" 
              value={newOrg.website}
              onChange={e => setNewOrg({...newOrg, website: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input 
              type="text" 
              value={newOrg.address}
              onChange={e => setNewOrg({...newOrg, address: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Logo URL:</label>
            <input 
              type="url" 
              value={newOrg.logoUrl}
              onChange={e => setNewOrg({...newOrg, logoUrl: e.target.value})}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">Create Organization</button>
          </div>
        </form>
      )}

      {organizations.length === 0 ? (
        <p className="empty-state">You haven't created any organizations yet.</p>
      ) : (
        <div className="organizations-grid">
          {organizations.map(org => (
            <div key={org.id} className="organization-card">
              <div className="organization-logo">
                {org.logoUrl ? (
                  <img src={org.logoUrl} alt={org.name} />
                ) : (
                  <div className="org-initials">{org.name.charAt(0)}</div>
                )}
              </div>
              <div className="organization-details">
                <h4>{org.name}</h4>
                <p className="industry">{org.industry}</p>
                <p className="description">{org.description.substring(0, 100)}...</p>
              </div>
              <div className="organization-actions">
                <Link to={`/organizations/${org.id}`} className="view-btn">View</Link>
                <button 
                  className="switch-btn"
                  onClick={() => onOrganizationSelect(org)}
                >
                  Switch to Business View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizationsList;
