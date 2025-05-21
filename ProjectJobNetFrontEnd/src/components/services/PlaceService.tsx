import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { API_BASE_URL } from '../../constants.ts';
import { useNavigate } from 'react-router-dom';
import ServiceForm from './ServiceForm.tsx';
import './PlaceService.css';

function PlaceService() {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not logged in
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/categories`);
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        setCategories(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load categories');
      }
    };
    
    fetchCategories();
  }, [token, navigate]);

  const handleSubmitService = async (serviceData: any) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/services`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          ...serviceData,
          userId: user.id, 
          upvotes: 0, 
          downvotes: 0 
        })
      });
      
      if (!res.ok) throw new Error('Failed to add service');
      
      // Redirect to services page after successful creation
      navigate('/services');
    } catch (err: any) {
      setError(err.message || 'Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null; // Avoid rendering if not logged in

  return (
    <div className="place-service-container">
      <div className="place-service-header">
        <h2>Create a New Service</h2>
        <p>Complete the form below to offer your service.</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <ServiceForm 
        onSubmit={handleSubmitService}
        categories={categories}
        loading={loading}
        buttonText="Create Service"
        onCancel={() => navigate('/services')}
      />
    </div>
  );
}

export default PlaceService;