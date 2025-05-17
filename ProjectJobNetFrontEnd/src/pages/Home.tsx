import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import BlogStrip from './BlogStrip.tsx'; // NEW: Added import

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div style={{ padding: 32 }}>
        <h1>Welcome to ProjectJobNet</h1>
        <p>Your go-to platform for jobs, services, and blog posts.</p>
      </div>
      <div className="main-cards-container">
        <div className="main-card">
          <h3>Employers</h3>
          <div className="subblocks">
            {/* Updated: Now clickable to create a vacancy */}
            <div className="subblock clickable" onClick={() => navigate('/createVacancy')}>
              <h5>Place Vacancy</h5>
              <p>Post a job opening and find the right candidate for your company.</p>
            </div>
            <div
              className="subblock clickable"
              onClick={() => navigate('/services')}
              style={{ cursor: 'pointer' }}
            >
              <h5>Look for Services</h5>
              <p>Find skilled workers for hourly tasks and quick jobs.</p>
            </div>
          </div>
        </div>
        <div className="main-card">
          <h3>JobSeeker</h3>
          <div className="subblocks">
            {/* Updated: Now clickable to create a service */}
            <div className="subblock clickable" onClick={() => navigate('/createService')}>
              <h5>Place Service</h5>
              <p>Offer your skills for hourly paid tasks and get hired quickly.</p>
            </div>
            <div
              className="subblock clickable"
              onClick={() => navigate('/vacancies')}
              style={{ cursor: 'pointer' }}
            >
              <h5>Look for Vacancies</h5>
              <p>Browse job openings and apply for your next career move.</p>
            </div>
          </div>
        </div>
      </div>
      {/* NEW: BlogStrip component displayed under the main blocks */}
      <BlogStrip />
    </>
  );
}

export default Home;
