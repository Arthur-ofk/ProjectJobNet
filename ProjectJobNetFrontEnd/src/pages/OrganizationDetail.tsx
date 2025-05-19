import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store.ts';
import { API_BASE_URL } from '../constants.ts';
import SafeImage from '../components/SafeImage.tsx';
import OrganizationMembers from '../components/organization/OrganizationMembers.tsx';
import OrganizationServices from '../components/organization/OrganizationServices.tsx';
import OrganizationVacancies from '../components/organization/OrganizationVacancies.tsx';
import './OrganizationDetail.css';

type Organization = {
  id: string;
  name: string;
  description: string;
  industry: string;
  website: string;
  address: string;
  logoUrl: string;
  ownerUserId: string;
  createdAt: string;
  updatedAt: string;
};

function OrganizationDetail() {
  const { id } = useParams<{id: string}>();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [owner, setOwner] = useState<{id: string, userName: string} | null>(null);
  const [activeTab, setActiveTab] = useState<'members' | 'services' | 'vacancies'>('members');
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    // Fetch organization details
    fetch(`${API_BASE_URL}/organization/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to load organization: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setOrganization(data);
        
        // Check if current user is the owner
        if (user && user.id === data.ownerUserId) {
          setIsOwner(true);
        }
        
        // Fetch owner details
        return fetch(`${API_BASE_URL}/users/${data.ownerUserId}`);
      })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to load owner: ${res.status}`);
        }
        return res.json();
      })
      .then(userData => {
        setOwner(userData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading organization:", err);
        setError(err.message || "Failed to load organization");
        setLoading(false);
      });
  }, [id, user]);

  if (loading) return <div className="loading">Loading organization details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!organization) return <div className="not-found">Organization not found</div>;

  return (
    <div className="organization-detail-container">
      <div className="org-header">
        <div className="org-logo-container">
          <SafeImage 
            src={organization.logoUrl || `https://via.placeholder.com/150?text=${organization.name.charAt(0)}`}
            alt={organization.name}
            className="org-logo"
            fallbackSrc="/default-organization-logo.png"
          />
        </div>
        <div className="org-info">
          <h1 className="org-name">{organization.name}</h1>
          <div className="org-metadata">
            <div className="org-industry">{organization.industry}</div>
            {organization.website && (
              <a href={organization.website} target="_blank" rel="noopener noreferrer" className="org-website">
                {organization.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            {owner && (
              <div className="org-owner">
                Owner: <Link to={`/users/${owner.id}`}>{owner.userName}</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="org-description">
        <h3>About</h3>
        <p>{organization.description}</p>
        {organization.address && (
          <div className="org-address">
            <strong>Address:</strong> {organization.address}
          </div>
        )}
      </div>

      <div className="org-tabs">
        <button 
          className={`tab-button ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Members
        </button>
        <button 
          className={`tab-button ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          Services
        </button>
        <button 
          className={`tab-button ${activeTab === 'vacancies' ? 'active' : ''}`}
          onClick={() => setActiveTab('vacancies')}
        >
          Vacancies
        </button>
      </div>

      <div className="org-content">
        {activeTab === 'members' && (
          <OrganizationMembers orgId={id!} token={token} isOwner={isOwner} />
        )}
        
        {activeTab === 'services' && (
          <OrganizationServices orgId={id!} token={token} />
        )}
        
        {activeTab === 'vacancies' && (
          <OrganizationVacancies orgId={id!} token={token} />
        )}
      </div>
    </div>
  );
}

export default OrganizationDetail;
