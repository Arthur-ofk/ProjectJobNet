import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import Contact from './pages/Contact.tsx';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import './index.css';
import { Provider } from 'react-redux';
import store from './store.ts';
import AllVacancies from './pages/AllVacancies.tsx';
import AllServices from './pages/AllServices.tsx';
import VacancyDetail from './pages/VacancyDetail.tsx';
import ServiceDetail from './pages/ServiceDetail.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import UserProfile from './pages/UserProfile.tsx';
import PlaceVacancy from './pages/PlaceVacancy.tsx';
import PlaceService from './pages/PlaceService.tsx';
import BlogSection from './pages/BlogSection.tsx';
import PostDetail from './pages/PostDetail.tsx'; // NEW: Import detailed blog post view
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div style={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'stretch',
          background: '#f5f5f5'
        }}>
          <div style={{
            width: '80%',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            
            <main className="main-container" style={{ flex: 1 }}>
              <div><Header /></div>
              <div className="main-container">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/vacancies" element={<AllVacancies />} />
                  <Route path="/services" element={<AllServices />} />
                  <Route path="/vacancies/:id" element={<VacancyDetail />} />
                  <Route path="/services/:id" element={<ServiceDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<UserProfile />} />
                  {/* Updated routes for creating new items */}
                  <Route path="/createVacancy" element={<PlaceVacancy />} />
                  <Route path="/createService" element={<PlaceService />} />
                  <Route path="/blog" element={<BlogSection />} />
                  <Route path="/posts/:id" element={<PostDetail />} /> {/* NEW: Detailed blog post route */}
                </Routes>
              </div>
              <div><Footer /></div>
            </main>
            
           
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
