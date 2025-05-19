import React, { useState } from 'react';
import { API_BASE_URL } from '../../constants.ts';

type ProfileSettingsProps = {
  user: any;
  token: string;
  onLogout: () => void;
};

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  user,
  token,
  onLogout
}) => {
  const [settings, setSettings] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    address: user.address || '',
    phoneNumber: user.phoneNumber || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const res = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      
      if (!res.ok) throw new Error('Failed to update profile');
      
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError('Update failed: ' + (err?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-settings">
      <div className="section-header">
        <h3>Profile Settings</h3>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSaveSettings} className="settings-form">
        <div className="form-group">
          <label>First Name:</label>
          <input 
            type="text"
            name="firstName"
            value={settings.firstName}
            onChange={handleSettingsChange}
          />
        </div>
        
        <div className="form-group">
          <label>Last Name:</label>
          <input 
            type="text"
            name="lastName"
            value={settings.lastName}
            onChange={handleSettingsChange}
          />
        </div>
        
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email"
            name="email"
            value={settings.email}
            onChange={handleSettingsChange}
          />
        </div>
        
        <div className="form-group">
          <label>Address:</label>
          <input 
            type="text"
            name="address"
            value={settings.address}
            onChange={handleSettingsChange}
          />
        </div>
        
        <div className="form-group">
          <label>Phone Number:</label>
          <input 
            type="text"
            name="phoneNumber"
            value={settings.phoneNumber}
            onChange={handleSettingsChange}
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="save-btn"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          
          <button 
            type="button"
            className="logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
