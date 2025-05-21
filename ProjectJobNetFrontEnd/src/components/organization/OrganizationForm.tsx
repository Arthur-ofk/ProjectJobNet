import React, { useState, useEffect } from 'react';
import './OrganizationForm.css';

interface OrganizationFormProps {
  organization: any;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({
  organization,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: organization.name || '',
    industry: organization.industry || '',
    website: organization.website || '',
    address: organization.address || '',
    description: organization.description || '',
  });

  // Update form data when organization changes
  useEffect(() => {
    setFormData({
      name: organization.name || '',
      industry: organization.industry || '',
      website: organization.website || '',
      address: organization.address || '',
      description: organization.description || '',
    });
  }, [organization]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={onSubmit} className="edit-form">
      <div className="form-group">
        <label>Organization Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="form-group">
        <label>Industry</label>
        <input
          type="text"
          name="industry"
          value={formData.industry}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="form-group">
        <label>Website</label>
        <input
          type="url"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="form-group">
        <label>Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        ></textarea>
      </div>
      
      <div className="form-actions">
        <button type="submit" className="btn btn--primary save-btn">
          Save Changes
        </button>
        <button type="button" className="btn btn--outline" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default OrganizationForm;
