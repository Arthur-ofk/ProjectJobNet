import React, { useState } from 'react';
import { API_BASE_URL } from '../../constants.ts';
import InfoCard from '../../components/InfoCard.tsx';

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
  const [newService, setNewService] = useState({
    serviceName: '',
    description: '',
    price: '',
    categoryId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.serviceName || !newService.description || !newService.price || !newService.categoryId) {
      setError('All fields are required.');
      return;
    }
    
    if (isNaN(Number(newService.price))) {
      setError('Price must be a number.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE_URL}/services`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: userId,
          categoryId: newService.categoryId,
          serviceName: newService.serviceName,
          description: newService.description,
          price: Number(newService.price),
          upvotes: 0,
          downvotes: 0
        })
      });
      
      if (!res.ok) throw new Error('Failed to add service');
      
      setShowAddService(false);
      setNewService({ serviceName: '', description: '', price: '', categoryId: '' });
      
      // Refresh services
      const refreshRes = await fetch(`${API_BASE_URL}/services`);
      if (!refreshRes.ok) throw new Error('Failed to refresh services');
      
      const allServices = await refreshRes.json();
      setServices(allServices.filter((s: Service) => s.userId === userId));
    } catch (err: any) {
      setError('Add service failed: ' + (err?.message || 'Unknown error'));
    } finally {
      setLoading(false);
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
      
      // Update local state
      setServices(services.filter(s => s.id !== serviceId));
    } catch (err: any) {
      setError('Delete failed: ' + (err?.message || 'Unknown error'));
    }
  };

  return (
    <div className="services-section">
      <div className="section-header">
        <h3>Your Services</h3>
        <button 
          className="action-button"
          onClick={() => setShowAddService(!showAddService)}
        >
          {showAddService ? 'Cancel' : 'Add Service'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showAddService && (
        <form onSubmit={handleAddServiceSubmit} className="add-service-form">
          <h4>Create New Service</h4>
          <div className="form-group">
            <label>Service Name:</label>
            <input 
              type="text" 
              value={newService.serviceName}
              onChange={e => setNewService({...newService, serviceName: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea 
              value={newService.description}
              onChange={e => setNewService({...newService, description: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input 
              type="text" 
              value={newService.price}
              onChange={e => setNewService({...newService, price: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Category:</label>
            <select
              value={newService.categoryId}
              onChange={e => setNewService({...newService, categoryId: e.target.value})}
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Service'}
            </button>
          </div>
        </form>
      )}

      {services.length === 0 ? (
        <p className="empty-state">You haven't created any services yet.</p>
      ) : (
        <div className="services-grid">
          {services.map(service => (
            <div key={service.id} className="service-card">
              <InfoCard
                title={service.serviceName}
                subtitle={`Price: $${service.price}`}
                description={service.description}
              />
              <div className="card-actions">
                <button onClick={() => handleDeleteService(service.id)} className="delete-btn">
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
