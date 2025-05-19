import React from 'react';
import { Link } from 'react-router-dom';
import InfoCard from '../InfoCard.tsx';

type SavedItemsTabProps = {
  savedPosts: any[];
  savedVacancies: any[];
  savedServices: any[];
  savedSubTab: 'posts' | 'vacancies' | 'services';
  setSavedSubTab: (tab: 'posts' | 'vacancies' | 'services') => void;
};

const SavedItemsTab: React.FC<SavedItemsTabProps> = ({
  savedPosts,
  savedVacancies,
  savedServices,
  savedSubTab,
  setSavedSubTab
}) => {
  return (
    <div className="saved-items-tab">
      <div className="saved-subtabs">
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

      <div className="saved-items-content">
        {savedSubTab === 'posts' && (
          <div className="saved-posts">
            {savedPosts.length === 0 ? (
              <p>No saved posts.</p>
            ) : (
              <div className="cards-grid">
                {savedPosts.map(post => (
                  <Link to={`/posts/${post.id}`} key={post.id}>
                    <InfoCard
                      title={post.title}
                      subtitle={new Date(post.createdAt).toLocaleDateString()}
                      description={post.content.slice(0, 100) + '...'}
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {savedSubTab === 'vacancies' && (
          <div className="saved-vacancies">
            {savedVacancies.length === 0 ? (
              <p>No saved vacancies.</p>
            ) : (
              <div className="cards-grid">
                {savedVacancies.map(vacancy => (
                  <Link to={`/vacancies/${vacancy.id}`} key={vacancy.id}>
                    <InfoCard
                      title={vacancy.title}
                      subtitle={`${vacancy.location} | $${vacancy.salary}`}
                      description={vacancy.description.slice(0, 100) + '...'}
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {savedSubTab === 'services' && (
          <div className="saved-services">
            {savedServices.length === 0 ? (
              <p>No saved services.</p>
            ) : (
              <div className="cards-grid">
                {savedServices.map(service => (
                  <Link to={`/services/${service.id}`} key={service.id}>
                    <InfoCard
                      title={service.serviceName}
                      subtitle={`Price: $${service.price}`}
                      description={service.description.slice(0, 100) + '...'}
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedItemsTab;
