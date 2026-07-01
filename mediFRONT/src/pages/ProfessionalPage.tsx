import React from 'react';
import { Sidebar } from '../components/professional/Sidebar';
import { Topbar } from '../components/professional/Topbar';
import { Outlet, useLocation } from 'react-router-dom';

const ProfessionalPage: React.FC = () => {
  const location = useLocation();

  const isFullscreenRoute = 
    location.pathname.includes('/pro/agenda') || 
    location.pathname.includes('/pro/config') || 
    location.pathname.includes('/pro/profile') ||
    location.pathname.includes('/doctor/calendar') ||
    location.pathname.includes('/doctor/settings') ||
    location.pathname.includes('/doctor/profile');


  return (
    <div className="flex h-screen bg-[#FDF9F3] overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        {!isFullscreenRoute && <Topbar />}

        {/* Dashboard Content */}
        <main className="flex-1 flex flex-col relative overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProfessionalPage;
