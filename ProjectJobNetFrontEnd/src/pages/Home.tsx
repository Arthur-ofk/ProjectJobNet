import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="main-cards-container">
      <div className="main-card">
        <h3>Employers</h3>
        <div className="subblocks">
          <div className="subblock">
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
          <div className="subblock">
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
  );
}

export default Home;
