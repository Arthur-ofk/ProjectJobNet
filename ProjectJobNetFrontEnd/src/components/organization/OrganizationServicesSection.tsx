

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../constants.ts';
import { Link } from 'react-router-dom';
import './OrganizationServicesSection.css';

interface Service {
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
}

const OrganizationServicesSection: React.FC<OrganizationServicesSectionProps> = ({
  organization,
  token
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!organization?.id) return;

    setLoading(true);
    setError(null);
    
    // Create headers with token if available
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Fetch services for this organization
    fetch(`${API_BASE_URL}/services?organizationId=${organization.id}`, { headers })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch services: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setServices(Array.isArray(data) ? data : []);
        
        // After getting services, fetch categories to display category names
        return fetch(`${API_BASE_URL}/categories`, { headers });
      })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch categories: ${res.status}`);
        }
        return res.json();
      })
      .then(categoryData => {
        setCategories(Array.isArray(categoryData) ? categoryData : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading organization services:", err);
        setError(err.message || "Failed to load services");
        setLoading(false);
      });
  }, [organization?.id, token]);

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
        {token && (
          <Link to={`/createService?orgId=${organization.id}`} className="add-button">
            Add New Service
          </Link>
        )}
      </div>

      {services.length === 0 ? (
        <p className="empty-state">No services available from this organization yet.</p>
      ) : (
        <div className="services-grid">
          {services.map(service => (
            <div key={service.id} className="service-card">
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
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizationServicesSection;