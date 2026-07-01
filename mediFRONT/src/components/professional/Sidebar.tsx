import React, { useState } from 'react';
import { Calendar, Users, Settings, LogOut, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo_pro.png';
import { cn } from '../../utils/cn';

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  
  const menuItems = [
    { icon: Calendar, label: 'Agenda', path: '/doctor/calendar' },
    { icon: Settings, label: 'Configuración', path: '/doctor/settings' },
    { icon: Users, label: 'Perfil Público', path: '/doctor/profile' },
  ];

  const handleLogout = () => {
    logout();
  };


  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#1C365C] min-h-screen flex flex-col text-white relative shadow-2xl z-50"
    >
      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-[#5A9BD4] rounded-full flex items-center justify-center border-2 border-[#1C365C] shadow-lg hover:scale-110 active:scale-95 transition-all z-10"
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      <div className={cn("p-8 mb-4 flex transition-all duration-300", isCollapsed ? "justify-center px-4" : "justify-center")}>
        <motion.img 
          animate={{ scale: isCollapsed ? 0.8 : 1 }}
          src={logo} 
          alt="MediFind" 
          className={cn("brightness-0 invert object-contain transition-all", isCollapsed ? "h-8" : "h-16")} 
        />
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname.includes(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center p-3 rounded-xl transition-all group overflow-hidden",
                isActive 
                  ? 'bg-[#5A9BD4] text-white' 
                  : 'hover:bg-white/5 text-slate-400 hover:text-white',
                isCollapsed ? "justify-center" : "justify-between"
              )}
            >
              <div className="flex items-center gap-3 shrink-0">
                <item.icon className={cn("w-5 h-5 transition-colors", isActive ? 'text-white' : 'group-hover:text-[#5A9BD4]')} />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="font-bold text-sm whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              {!isCollapsed && isActive && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={handleLogout}
          className={cn(
            "flex items-center p-3 w-full text-slate-400 hover:text-red-400 transition-colors overflow-hidden",
            isCollapsed ? "justify-center" : "gap-3"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="font-bold text-sm whitespace-nowrap">Cerrar Sesión</span>}
        </button>
      </div>
    </motion.div>
  );
};
