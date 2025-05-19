import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import InfoCard from '../../components/InfoCard.tsx';
import './SavedItemsSection.css';

type BlogPost = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  userId: string;
};

type SavedItemsSectionProps = {
  savedPosts: BlogPost[];
  savedVacancies: any[];
  savedServices: any[];
};

const SavedItemsSection: React.FC<SavedItemsSectionProps> = ({
  savedPosts,
  savedVacancies,
  savedServices
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'vacancies' | 'services'>('posts');

  return (
    <div className="saved-items-section">
      <h3>Saved Items</h3>
      
      {/* Subtabs Navigation */}
      <div className="saved-items-subtabs">
        <button 
          className={`subtab-button ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts ({savedPosts.length})
        </button>
        <button 
          className={`subtab-button ${activeTab === 'vacancies' ? 'active' : ''}`}
          onClick={() => setActiveTab('vacancies')}
        >
          Vacancies ({savedVacancies.length})
        </button>
        <button 
          className={`subtab-button ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          Services ({savedServices.length})
        </button>
      </div>
      
      {/* Content based on active tab */}
      <div className="saved-items-content">
        {activeTab === 'posts' && (
          <>
            {savedPosts.length === 0 ? (
              <p className="empty-state">You haven't saved any posts yet.</p>
            ) : (
              <div className="saved-posts-grid">
                {savedPosts.map((post) => (
                  <div key={post.id} className="saved-card">
                    <h5>{post.title}</h5>
                    <p>{post.content?.substring(0, 100)}...</p>
                    <button className="view-btn">View Post</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {activeTab === 'vacancies' && (
          <>
            {savedVacancies.length === 0 ? (
              <p className="empty-state">You haven't saved any vacancies yet.</p>
            ) : (
              <div className="saved-vacancies-grid">
                {savedVacancies.map((vacancy) => (
                  <div key={vacancy.id} className="saved-card">
                    <h5>{vacancy.title}</h5>
                    <p>Salary: ${vacancy.salary}</p>
                    <p>Location: {vacancy.location}</p>
                    <button className="view-btn">View Vacancy</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {activeTab === 'services' && (
          <>
            {savedServices.length === 0 ? (
              <p className="empty-state">You haven't saved any services yet.</p>
            ) : (
              <div className="saved-services-grid">
                {savedServices.map((service) => (
                  <div key={service.id} className="saved-card">
                    <h5>{service.serviceName}</h5>
                    <p>Price: ${service.price}</p>
                    <p>{service.description?.substring(0, 100)}...</p>
                    <button className="view-btn">View Service</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SavedItemsSection;
