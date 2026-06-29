import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegisterPatientPage from './pages/RegisterPatientPage';
import RegisterDoctorPage from './pages/RegisterDoctorPage';
import RegisterClinicPage from './pages/RegisterClinicPage';
import ProfilePage from './pages/ProfilePage';
import ProfessionalPage from './pages/ProfessionalPage';
import AgendaPage from './pages/professional/AgendaPage';
import ConfigPage from './pages/professional/ConfigPage';
import PublicProfilePage from './pages/professional/PublicProfilePage';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isProRoute = location.pathname.startsWith('/pro');

  return (
    <div className="min-h-screen bg-[#FDF9F3]">
      <Navbar />
      <main className={isProRoute ? "" : "pt-20"}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/buscar" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/registro/paciente" element={<RegisterPatientPage />} />
          <Route path="/registro/medico" element={<RegisterDoctorPage />} />
          <Route path="/registro/clinica" element={<RegisterClinicPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          
          <Route path="/pro" element={<ProfessionalPage />}>
            <Route index element={<Navigate to="agenda" replace />} />
            <Route path="agenda" element={<AgendaPage />} />
            <Route path="config" element={<ConfigPage />} />
            <Route path="profile" element={<PublicProfilePage />} />
          </Route>

          {/* Fallback to home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
