import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createVacancyRequest, updateVacancyRequest } from '../../store/actions/vacancyActions.ts';
import FormField from '../../components/shared/FormField.tsx';
import './VacancyForm.css';

interface VacancyFormProps {
  vacancyId?: string;
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
  onSubmit?: (formData: any) => Promise<void>;
}

const VacancyForm: React.FC<VacancyFormProps> = ({
  vacancyId,
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
  showCancelButton = true,
  onSubmit
}) => {
  const [formData, setFormData] = useState(initialData);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

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
      if (onSubmit) {
        await onSubmit(formData);
      } else if (vacancyId) {
        dispatch(updateVacancyRequest({ vacancyId, formData }));
      } else {
        dispatch(createVacancyRequest(formData));
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className="form-container vacancy-form-container">
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="standard-form vacancy-form">
        <FormField
          label="Job Title"
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter job title"
        />

        <FormField
          label="Description"
          id="description"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Describe the job role and responsibilities"
        />

        <FormField
          label="Category"
          id="categoryId"
          name="categoryId"
          type="select"
          value={formData.categoryId}
          onChange={handleChange}
          required
          options={jobCategories.map(category => ({
            value: category.id,
            label: category.name || category.categoryName || 'Unknown Category'
          }))}
        />

        <div className="form-section">
          <h4>Job Details</h4>

          <FormField
            label="Location"
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="Job location"
          />

          <FormField
            label="Employment Type"
            id="employmentType"
            name="employmentType"
            type="select"
            value={formData.employmentType}
            onChange={handleChange}
            required
            options={[
              { value: '', label: '-- Select Type --' },
              { value: 'full-time', label: 'Full Time' },
              { value: 'part-time', label: 'Part Time' },
              { value: 'contract', label: 'Contract' },
              { value: 'temporary', label: 'Temporary' },
              { value: 'internship', label: 'Internship' }
            ]}
          />

          <div className="form-group">
            <label>Salary Range:</label>
            <div className="input-group salary-range">
              <FormField
                label="Minimum Salary"
                id="minSalary"
                name="minSalary"
                type="number"
                value={formData.minSalary}
                onChange={handleChange}
                placeholder="Minimum"
                className="salary-input"
              />
              <span className="input-group-text">-</span>
              <FormField
                label="Maximum Salary"
                id="maxSalary"
                name="maxSalary"
                type="number"
                value={formData.maxSalary}
                onChange={handleChange}
                placeholder="Maximum"
                className="salary-input"
              />
              <span className="input-group-text currency">USD</span>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Processing...' : buttonText}
          </button>

          {showCancelButton && onCancel && (
            <button type="button" className="btn btn--outline" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default VacancyForm;
