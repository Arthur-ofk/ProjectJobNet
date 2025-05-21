import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './OrganizationServicesSection.css';
import apiClient from '../../utils/apiClient.ts';

// Export Service type
export interface Service {
  id: string;
  serviceName: string;
  description: string;
  price: number;
  upvotes: number;
  downvotes?: number;
  userId: string;
  categoryId: string;
}

interface Category {
  id: string;
  categoryName: string;
  description?: string;
}

interface OrganizationServicesSectionProps {
  organization: any;
  token: string | null;
  services?: Service[]; // Added services property
  canEdit: boolean; // Added canEdit property
}

const ServiceCard: React.FC<{ service: Service; getCategoryName: (id: string) => string }> = ({ service, getCategoryName }) => (
  <div className="service-card">
    <Link to={`/services/${service.id}`} className="service-link">
      <h4>{service.serviceName}</h4>
      <div className="service-meta">
        <div className="service-price">${service.price.toFixed(2)}</div>
        <div className="service-category">{getCategoryName(service.categoryId)}</div>
      </div>
      <p className="service-description">{service.description}</p>
      <div className="service-stats">
        <span className="upvotes">
          <i className="icon-thumbs-up"></i> {service.upvotes || 0}
        </span>
      </div>
    </Link>
  </div>
);

const OrganizationServicesSection: React.FC<OrganizationServicesSectionProps> = ({
  organization,
  token,
  services: propServices, // Use propServices if provided
  canEdit // Added canEdit property
}) => {
  const [services, setServices] = useState<Service[]>(propServices || []); // Initialize with propServices if available
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propServices && organization?.id && token) {
      setLoading(true);
      setError(null);

      apiClient
        .get(`/services/organization/${organization.id}`)
        .then((response) => setServices(response.data))
        .catch((error) => {
          console.error("Failed to fetch services:", error);
          setError("Failed to fetch services");
        })
        .finally(() => setLoading(false));
    }
  }, [organization?.id, token, propServices]); // Only fetch if propServices is not provided

  useEffect(() => {
    if (organization?.id) {
      apiClient
        .get('/categories')
        .then((res) => setCategories(Array.isArray(res.data) ? res.data : []))
        .catch((err) => {
          console.error("Error loading categories:", err);
          setError("Failed to load categories");
        });
    }
  }, [organization?.id]);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.categoryName : 'Uncategorized';
  };

  if (loading) return <div className="loading">Loading services...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="organization-services-section">
      <div className="section-header">
        <h3>Services</h3>
        {canEdit && token && (
          <Link to={`/createService?orgId=${organization.id}`} className="btn btn--primary">
            Add New Service
          </Link>
        )}
      </div>

      {services.length === 0 ? (
        <p className="empty-state">No services available from this organization yet.</p>
      ) : (
        <div className="services-grid">
          {services.map(service => (
            <ServiceCard key={service.id} service={service} getCategoryName={getCategoryName} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizationServicesSection;