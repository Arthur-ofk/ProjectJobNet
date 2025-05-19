import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../slices/authSlice.ts';
import SafeImage from '../SafeImage.tsx';

type ProfileHeaderProps = {
  user: any;
  organizations: any[];
  viewMode: 'personal' | 'business';
  activeOrg: any | null;
  onSwitchViewMode: (mode: 'personal' | 'business', org?: any) => void;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  organizations,
  viewMode,
  activeOrg,
  onSwitchViewMode
}) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="profile-header">
      <div className="profile-avatar">
        <SafeImage 
          src={`https://i.pravatar.cc/150?u=${user?.id}`} 
          alt="Profile" 
        />
      </div>
      <div className="profile-info">
        <h2 className="profile-name">{user?.firstName} {user?.lastName}</h2>
        <p className="profile-username">@{user?.userName}</p>
        <p className="profile-email">{user?.email}</p>

        {organizations.length > 0 && (
          <div className="view-selector">
            <span>View as: </span>
            <button 
              className={viewMode === 'personal' ? 'active' : ''} 
              onClick={() => onSwitchViewMode('personal')}
            >
              Personal
            </button>
            <div className="org-dropdown">
              <button 
                className={viewMode === 'business' ? 'active' : ''}
              >
                {activeOrg?.name || 'Business'} ▼
              </button>
              <div className="dropdown-content">
                {organizations.map(org => (
                  <button key={org.id} onClick={() => onSwitchViewMode('business', org)}>
                    {org.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="profile-actions">
        <button 
          onClick={handleLogout} 
          className="logout-btn"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
