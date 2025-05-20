import React, { useState, useEffect } from 'react';
import './BlogPostForm.css';

interface BlogPostFormProps {
  onSubmit: (blogData: any) => Promise<void>;
  initialData?: {
    title: string;
    content: string;
    categoryId?: string;
  };
  categories?: any[];
  loading?: boolean;
  buttonText?: string;
  onCancel?: () => void;
  showCancelButton?: boolean;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({
  onSubmit,
  initialData = { title: '', content: '', categoryId: '' },
  categories = [],
  loading = false,
  buttonText = 'Publish Post',
  onCancel,
  showCancelButton = true
}) => {
  const [formData, setFormData] = useState(initialData);
  const [error, setError] = useState<string | null>(null);
  
  // Update local state when initialData changes (for edit mode)
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic form validation
    if (!formData.title || !formData.content) {
      setError('Title and content are required');
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
    <div className="blog-form-container">
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="blog-form">
        <div className="form-group">
          <label htmlFor="title">Blog Title:</label>
          <input 
            type="text" 
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter an engaging title"
            className="title-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea 
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={12}
            placeholder="Write your blog post content here..."
            className="content-input"
          />
        </div>
        
        {categories.length > 0 && (
          <div className="form-group">
            <label htmlFor="categoryId">Category:</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="category-select"
            >
              <option value="">-- Select a Category (Optional) --</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={loading}
          >
            {loading ? 'Saving...' : buttonText}
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

export default BlogPostForm;
