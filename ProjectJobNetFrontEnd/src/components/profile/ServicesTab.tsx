import React, { useState } from 'react';
import InfoCard from '../InfoCard.tsx';
import { Link } from 'react-router-dom';

type Service = {
  id: string;
  serviceName: string;
  description: string;
  price: number;
  upvotes: number;
  downvotes?: number;
  userId: string;
};

type Category = {
  id: string;
  categoryName: string;
  description: string;
};

type ServicesTabProps = {
  services: Service[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  showAddService: boolean;
  newService: {
    serviceName: string;
    description: string;
    price: string;
    categoryId: string;
  };
  setShowAddService: (show: boolean) => void;
  setNewService: (service: any) => void;
  onAddServiceSubmit: (e: React.FormEvent) => void;
};

const ServicesTab: React.FC<ServicesTabProps> = ({
  services,
  categories,
  loading,
  error,
  showAddService,
  newService,
  setShowAddService,
  setNewService,
  onAddServiceSubmit
}) => {
  return (
    <div className="services-tab">
      <div className="tab-header">
        <h3>My Services</h3>
        <button 
          className="add-service-btn"
          onClick={() => setShowAddService(!showAddService)}
        >
          {showAddService ? 'Cancel' : 'Add Service'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showAddService && (
        <form onSubmit={onAddServiceSubmit} className="add-service-form">
          <div className="form-group">
            <label htmlFor="serviceName">Service Name</label>
            <input
              id="serviceName"
              type="text"
              value={newService.serviceName}
              onChange={e => setNewService({ ...newService, serviceName: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={newService.description}
              onChange={e => setNewService({ ...newService, description: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              id="price"
              type="text"
              value={newService.price}
              onChange={e => setNewService({ ...newService, price: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={newService.categoryId}
              onChange={e => setNewService({ ...newService, categoryId: e.target.value })}
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>
          
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Adding...' : 'Add Service'}
          </button>
        </form>
      )}

      <div className="services-grid">
        {services.length === 0 && !loading ? (
          <p className="no-services">You haven't created any services yet.</p>
        ) : (
          services.map(service => (
            <Link to={`/services/${service.id}`} key={service.id} className="service-card-link">
              <InfoCard
                title={service.serviceName}
                subtitle={`Price: $${service.price}`}
                description={service.description}
              />
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ServicesTab;
