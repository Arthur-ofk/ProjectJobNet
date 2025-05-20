import React, { useState } from 'react';
import { API_BASE_URL } from '../../constants.ts';
import { Link } from 'react-router-dom';
import './OrganizationsList.css';

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
  logoImageData?: string;
  logoImageContentType?: string;
};

type Props = {
  organizations: Organization[];
  token: string | null;
  userId: string;
  onOrganizationCreate: (org: Organization) => void;
  onOrganizationSelect: (org: Organization) => void;
};

function OrganizationsList({ organizations, token, userId, onOrganizationCreate, onOrganizationSelect }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', industry: '', website: '', address: '' });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/Organization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          userId
        })
      });
      
      if (!response.ok) throw new Error('Failed to create organization');
      
      const createdOrg = await response.json();
      onOrganizationCreate(createdOrg);
      setShowForm(false);
      setForm({ name: '', description: '', industry: '', website: '', address: '' });
    } catch (err) {
      console.error('Failed to create organization:', err);
      alert('Failed to create organization');
    }
  };

  return (
    <div className="organizations-section">
      <div className="section-header">
        <h3>My Organizations</h3>
        <button 
          className="btn btn--primary create-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Create Organization'}
        </button>
      </div>
      
      {showForm && (
        <form className="create-org-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="org-name">Organization Name</label>
            <input
              id="org-name"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="org-industry">Industry</label>
            <input
              id="org-industry"
              name="industry"
              value={form.industry}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="org-description">Description</label>
            <textarea
              id="org-description"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="org-website">Website (optional)</label>
            <input
              id="org-website"
              name="website"
              value={form.website}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="org-address">Address (optional)</label>
            <input
              id="org-address"
              name="address"
              value={form.address}
              onChange={handleInputChange}
            />
          </div>
          
          <button type="submit" className="btn btn--primary save-btn">
            Create Organization
          </button>
        </form>
      )}
      
      <div className="organizations-grid">
        {organizations.length === 0 ? (
          <p className="empty-state">You don't have any organizations yet.</p>
        ) : (
          organizations.map(org => (
            <div key={org.id} className="organization-card">
              <div className="organization-logo">
                {org.logoImageData ? (
                  <img 
                    src={`data:${org.logoImageContentType || 'image/jpeg'};base64,${org.logoImageData}`}
                    alt={org.name}
                  />
                ) : (
                  <div className="org-placeholder">{org.name.charAt(0)}</div>
                )}
              </div>
              <div className="organization-details">
                <h4>{org.name}</h4>
                <span className="organization-industry">{org.industry}</span>
                <p className="organization-description">
                  {org.description.length > 120 ? org.description.substring(0, 120) + '...' : org.description}
                </p>
              </div>
              <div className="organization-actions">
                <button 
                  className="view-org-btn"
                  onClick={() => onOrganizationSelect(org)}
                >
                  View
                </button>
                <Link 
                  to={`/organizations/${org.id}`} 
                  className="edit-org-btn"
                >
                  Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default OrganizationsList;
