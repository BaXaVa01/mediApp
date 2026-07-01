import { NavLink, Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Search, User, Home, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../auth/AuthContext';

export const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  
  if (location.pathname.startsWith('/pro') || location.pathname.startsWith('/doctor')) return null;

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-[#1C365C]/5 bg-[#FDF9F3]/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-[#1C365C]">
          <div className="w-8 h-8 bg-[#5A9BD4] rounded-lg flex items-center justify-center text-white">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
          <span>Medi<span className="text-[#5A9BD4]">Find</span></span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {[
            { to: "/", icon: Home, label: "Inicio" },
            { to: "/buscar", icon: Search, label: "Buscar" },
            ...(isAuthenticated ? [{ to: "/perfil", icon: User, label: "Mi Cuenta" }] : []),
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative flex items-center gap-2 text-sm font-semibold transition-all hover:text-[#5A9BD4] ${
                  isActive ? 'text-[#5A9BD4]' : 'text-[#1C365C]/60'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="size-4" />
                  {item.label}
                  {isActive && (
                    <motion.div 
                      layoutId="nav-active"
                      className="absolute -bottom-[26px] left-0 right-0 h-0.5 bg-[#5A9BD4] rounded-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm font-bold text-[#1C365C]/80 pr-2">
                  {user?.displayName || user?.name}
                </span>
                {user?.accountType === 'DOCTOR' && (
                  <Link to="/doctor/calendar">
                    <Button variant="ghost" className="font-bold text-[#1C365C] hover:text-[#5A9BD4] hover:bg-transparent">
                      Panel Médico
                    </Button>
                  </Link>
                )}
                <Button 
                  onClick={logout}
                  className="bg-[#1C365C] text-white hover:bg-[#2C466C] px-6 rounded-xl font-bold"
                >
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="font-bold text-[#1C365C] hover:text-[#5A9BD4] hover:bg-transparent">
                    Entrar
                  </Button>
                </Link>
                <Link to="/registro">
                  <Button className="bg-[#1C365C] text-white hover:bg-[#2C466C] px-6 rounded-xl font-bold">
                    Únete
                  </Button>
                </Link>
              </>
            )}
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden text-[#1C365C]">
            <Menu className="size-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
};


