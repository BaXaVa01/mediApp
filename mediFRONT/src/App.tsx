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
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { RoleRoute } from './auth/RoleRoute';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isProRoute = location.pathname.startsWith('/pro') || location.pathname.startsWith('/doctor');

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
          
          {/* Public Patient/User Routes */}
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/perfil/:doctorId" element={<ProfilePage />} />
          
          {/* Protected Doctor Routes (require accountType DOCTOR) */}
          <Route 
            path="/doctor" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedAccountTypes={['DOCTOR']}>
                  <ProfessionalPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="calendar" replace />} />
            <Route path="calendar" element={<AgendaPage />} />
            <Route path="settings" element={<ConfigPage />} />
            <Route path="profile" element={<PublicProfilePage />} />
          </Route>

          {/* Legacy /pro redirects to /doctor */}
          <Route path="/pro" element={<Navigate to="/doctor" replace />} />
          <Route path="/pro/agenda" element={<Navigate to="/doctor/calendar" replace />} />
          <Route path="/pro/config" element={<Navigate to="/doctor/settings" replace />} />
          <Route path="/pro/profile" element={<Navigate to="/doctor/profile" replace />} />

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
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;

