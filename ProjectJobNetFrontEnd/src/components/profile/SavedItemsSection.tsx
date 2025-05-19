import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import InfoCard from '../../components/InfoCard.tsx';

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
  const [savedSubTab, setSavedSubTab] = useState<'posts' | 'vacancies' | 'services'>('posts');

  return (
    <div className="saved-items-section">
      <div className="section-header">
        <h3>Saved Items</h3>
      </div>
      
      <div className="saved-tabs">
        <button 
          className={savedSubTab === 'posts' ? 'active' : ''}
          onClick={() => setSavedSubTab('posts')}
        >
          Blog Posts
        </button>
        <button 
          className={savedSubTab === 'vacancies' ? 'active' : ''}
          onClick={() => setSavedSubTab('vacancies')}
        >
          Vacancies
        </button>
        <button 
          className={savedSubTab === 'services' ? 'active' : ''}
          onClick={() => setSavedSubTab('services')}
        >
          Services
        </button>
      </div>
      
      <div className="saved-content">
        {savedSubTab === 'posts' && (
          <div className="saved-posts">
            {savedPosts.length === 0 ? (
              <p className="empty-state">You haven't saved any blog posts yet.</p>
            ) : (
              <div className="saved-posts-grid">
                {savedPosts.map(post => (
                  <div key={post.id} className="blog-card">
                    <h4>{post.title}</h4>
                    <p>{post.content.substring(0, 100)}...</p>
                    <Link to={`/posts/${post.id}`}>Read more</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {savedSubTab === 'vacancies' && (
          <div className="saved-vacancies">
            {savedVacancies.length === 0 ? (
              <p className="empty-state">You haven't saved any vacancies yet.</p>
            ) : (
              <div className="saved-vacancies-grid">
                {savedVacancies.map(vacancy => (
                  <div key={vacancy.id} className="vacancy-card">
                    <Link to={`/vacancies/${vacancy.id}`}>
                      <InfoCard
                        title={vacancy.title}
                        subtitle={`Salary: $${vacancy.salary} | Location: ${vacancy.location}`}
                        description={vacancy.description.substring(0, 150) + '...'}
                      />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {savedSubTab === 'services' && (
          <div className="saved-services">
            {savedServices.length === 0 ? (
              <p className="empty-state">You haven't saved any services yet.</p>
            ) : (
              <div className="saved-services-grid">
                {savedServices.map(service => (
                  <div key={service.id} className="service-card">
                    <Link to={`/services/${service.id}`}>
                      <InfoCard
                        title={service.title}
                        subtitle={`Price: $${service.price}`}
                        description={service.description.substring(0, 150) + '...'}
                      />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedItemsSection;
