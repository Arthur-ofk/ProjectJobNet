import React from 'react';
import { Link } from 'react-router-dom';
import './OrganizationServicesTab.css';

interface OrganizationServicesTabProps {
  services: any[];
  canEdit: boolean;
}

const OrganizationServicesTab: React.FC<OrganizationServicesTabProps> = ({ services, canEdit }) => {
  return (
    <div className="org-services">
      <h3>Organization Services</h3>
      {canEdit && (
        <Link to="/createService" className="btn btn--primary create-btn">
          Add New Service
        </Link>
      )}
      <div className="services-list">
        {services.length === 0 ? (
          <p>No services offered by this organization.</p>
        ) : (
          <div className="cards-grid">
            {services.map((service: any) => (
              <Link to={`/services/${service.id}`} key={service.id} className="service-card card clickable">
                <h4>{service.serviceName}</h4>
                <div className="subtitle">
                  <span>Price: ${service.price}</span>
                  <span> | Rating: {service.upvotes || 0}</span>
                </div>
                <div className="desc">{service.description.substring(0, 150)}...</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationServicesTab;
