import React, { useState } from 'react';
import './VacancyForm.css';

interface VacancyFormProps {
  onSubmit: (jobData: any) => Promise<void>;
  initialData?: {
    title: string;
    description: string;
    location: string;
    employmentType: string;
    minSalary: string;
    maxSalary: string;
    categoryId: string;
  };
  jobCategories: any[];
  loading?: boolean;
  buttonText?: string;
  onCancel?: () => void;
  showCancelButton?: boolean;
}

const VacancyForm: React.FC<VacancyFormProps> = ({
  onSubmit,
  initialData = { 
    title: '', 
    description: '', 
    location: '', 
    employmentType: '',
    minSalary: '',
    maxSalary: '',
    categoryId: '' 
  },
  jobCategories = [],
  loading = false,
  buttonText = 'Post Job',
  onCancel,
  showCancelButton = true
}) => {
  const [formData, setFormData] = useState(initialData);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.categoryId) {
      setError('Title, description, and category are required.');
      return;
    }
    
    setError(null);
    
    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className="vacancy-form-container">
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="vacancy-form">
        <div className="form-group">
          <label htmlFor="title">Job Title:</label>
          <input 
            type="text" 
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
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
          >
            <option value="">-- Select a Category --</option>
            {jobCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="job-details-section">
          <h4>Job Details</h4>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location:</label>
              <input 
                type="text" 
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="employmentType">Employment Type:</label>
              <select
                id="employmentType"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                required
                className="category-select"
              >
                <option value="">-- Select Type --</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="temporary">Temporary</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Salary Range:</label>
            <div className="salary-range">
              <input 
                type="number" 
                name="minSalary"
                value={formData.minSalary}
                onChange={handleChange}
                placeholder="Minimum"
              />
              <span>-</span>
              <input 
                type="number" 
                name="maxSalary"
                value={formData.maxSalary}
                onChange={handleChange}
                placeholder="Maximum"
              />
              <span className="currency">USD</span>
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={loading}
          >
            {loading ? 'Processing...' : buttonText}
          </button>
          
          {showCancelButton && onCancel && (
            <button 
              type="button"
              className="cancel-btn"
              onClick={onCancel}
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

export default VacancyForm;
