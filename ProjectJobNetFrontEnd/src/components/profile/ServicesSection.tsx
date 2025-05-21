import React, { useState } from 'react';
import { API_BASE_URL } from '../../constants.ts';
import InfoCard from '../../components/InfoCard.tsx';
import './ServicesSection.css';
import { useNavigate } from 'react-router-dom';
import ServiceForm from '../services/ServiceForm.tsx';

type Service = {
  id: string;
  serviceName: string;
  description: string;
  price: number;
  upvotes: number;
  downvotes?: number;
  userId: string;
  categoryId: string;
};

type Category = {
  id: string;
  categoryName: string;
  description: string;
};

type ServicesSectionProps = {
  services: Service[];
  categories: Category[];
  token: string;
  userId: string;
  setServices: (services: Service[]) => void;
};

const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  categories,
  token,
  userId,
  setServices
}) => {
  const [showAddService, setShowAddService] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAddServiceSubmit = async (serviceData: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/services`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...serviceData,
          userId: userId,
          upvotes: 0,
          downvotes: 0
        })
      });
      
      if (!res.ok) throw new Error('Failed to add service');
      
      setShowAddService(false);
      
      const refreshRes = await fetch(`${API_BASE_URL}/services`);
      if (!refreshRes.ok) throw new Error('Failed to refresh services');
      
      const allServices = await refreshRes.json();
      setServices(allServices.filter((s: Service) => s.userId === userId));
    } catch (err: any) {
      throw new Error('Add service failed: ' + (err?.message || 'Unknown error'));
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error('Failed to delete service');
      
      setServices(services.filter(s => s.id !== serviceId));
    } catch (err: any) {
      setError('Delete failed: ' + (err?.message || 'Unknown error'));
    }
  };

  const handleCreateService = () => {
    setShowAddService(true);
    setError(null);
  };

  const handleEditService = (service: any) => {
    navigate(`/services/edit/${service.id}`, { state: { service } });
  };

  return (
    <div className="services-section">
      <div className="section-header">
        <h3>Your Services</h3>
        <button 
          className="create-service-btn"
          onClick={handleCreateService}
          disabled={loading}
        >
          Create Service
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showAddService && (
        <ServiceForm
          onSubmit={handleAddServiceSubmit}
          categories={categories}
          loading={loading}
          buttonText="Create Service"
          onCancel={() => setShowAddService(false)}
        />
      )}

      {services.length === 0 ? (
        <p className="empty-state">You haven't created any services yet.</p>
      ) : (
        <div className="services-list">
          {services.map(service => (
            <div key={service.id} className="service-item">
              <div className="service-info">
                <h4>{service.serviceName}</h4>
                <p className="service-description">{service.description}</p>
                <p className="service-price">${service.price.toFixed(2)}</p>
                <div className="service-category">
                  {categories.find(c => c.id === service.categoryId)?.categoryName || 'Uncategorized'}
                </div>
              </div>
              <div className="service-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEditService(service)}
                  disabled={loading}
                >
                  Edit
                </button>
                <a
                  href={`/services/${service.id}`}
                  className="view-btn"
                >
                  View
                </a>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteService(service.id)}
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesSection;
