import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../constants.ts';
import InfoCard from '../InfoCard.tsx';
import { Link } from 'react-router-dom';
import SafeImage from '../SafeImage.tsx';
import apiClient from '../../utils/apiClient';

type Service = {
  id: string;
  serviceName: string;
  description: string;
  price: number;
  upvotes: number;
  downvotes?: number;
  userId: string;
};

type OrganizationServicesProps = {
  orgId: string;
  token: string | null;
};

const OrganizationServices: React.FC<OrganizationServicesProps> = ({ orgId, token }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orgId) return;

    setLoading(true);
    setError(null);

    apiClient.get(`/services/organization/${orgId}`)
      .then(res => setServices(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        console.error("Error loading organization services:", err);
        setError(err.response?.data?.message || "Failed to load services");
        setServices([]);
      })
      .finally(() => setLoading(false));
  }, [orgId, token]);

  if (loading) return <div className="loading">Loading services...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="org-services">
      <h3>Services</h3>
      
      <Link to={`/createService?orgId=${orgId}`} className="btn btn--primary add-button">
        Add New Service
      </Link>
      
      {services.length === 0 ? (
        <p className="empty-state">No services yet. Add a service to get started.</p>
      ) : (
        <div className="services-grid">
          {services.map(service => (
            <Link to={`/services/${service.id}`} key={service.id} className="service-link">
              <InfoCard
                title={service.serviceName}
                subtitle={`Price: $${service.price}`}
                description={service.description}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizationServices;
