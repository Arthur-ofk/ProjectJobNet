import React, { useState, useRef } from 'react';
import './ServiceForm.css';

interface ServiceFormProps {
  onSubmit: (serviceData: any) => Promise<void>;
  initialData?: {
    serviceName: string;
    description: string;
    price: string | number;
    categoryId: string;
  };
  categories: any[];
  loading?: boolean;
  buttonText?: string;
  onCancel?: () => void;
  showCancelButton?: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  onSubmit,
  initialData = { serviceName: '', description: '', price: '', categoryId: '' },
  categories,
  loading = false,
  buttonText = 'Create Service',
  onCancel,
  showCancelButton = true
}) => {
  const initialDataRef = useRef(initialData);
  const [formData, setFormData] = useState({...initialDataRef.current});
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!formData.serviceName || !formData.description || !formData.price || !formData.categoryId) {
      setError('All fields are required.');
      return;
    }
    
    if (isNaN(Number(formData.price))) {
      setError('Price must be a number.');
      return;
    }
    
    setError(null);
    
    try {
      await onSubmit({
        ...formData,
        price: Number(formData.price)
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  const handleFormClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="service-form-container" onClick={handleFormClick}>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="service-form" onClick={handleFormClick}>
        <div className="form-group">
          <label htmlFor="serviceName">Service Name:</label>
          <input 
            type="text" 
            id="serviceName"
            name="serviceName"
            value={formData.serviceName}
            onChange={handleChange}
            required
            onClick={e => e.stopPropagation()}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea 
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={5}
            onClick={e => e.stopPropagation()}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Price ($):</label>
          <input 
            type="text" 
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            placeholder="0.00"
            onClick={e => e.stopPropagation()}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="categoryId">Category:</label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="category-select"
            onClick={e => e.stopPropagation()}
          >
            <option value="">-- Select a Category --</option>
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
            onClick={e => e.stopPropagation()}
          >
            {loading ? 'Processing...' : buttonText}
          </button>
          
          {showCancelButton && onCancel && (
            <button 
              type="button"
              className="cancel-btn"
              onClick={(e) => {
                e.stopPropagation();
                onCancel();
              }}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;
