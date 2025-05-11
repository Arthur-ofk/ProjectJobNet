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
            <Header />
            <main style={{ flex: 1, backgroundColor: '#e9ecef', padding: '32px 0', borderRadius: '24px', marginBottom: '0' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/vacancies" element={<AllVacancies />} />
                <Route path="/services" element={<AllServices />} />
                <Route path="/vacancies/:id" element={<VacancyDetail />} />
                <Route path="/services/:id" element={<ServiceDetail />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
