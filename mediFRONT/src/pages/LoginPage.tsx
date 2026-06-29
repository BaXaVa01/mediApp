import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { LogIn, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isPro = email.trim().toLowerCase() === 'admin@email.com';
    const role = isPro ? 'pro' : 'patient';
    
    login({ email, password, role });

    let target = from;
    if (target === '/') {
      target = isPro ? '/pro/agenda' : '/buscar';
    } else if (isPro && !target.startsWith('/pro')) {
      target = '/pro/agenda';
    } else if (!isPro && target.startsWith('/pro')) {
      target = '/buscar';
    }

    navigate(target, { replace: true });
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-white">
      {/* Left Side: Brand/Visual */}
      <div className="hidden lg:flex flex-1 bg-[#FDF9F3] relative items-center justify-center overflow-hidden border-r border-[#1C365C]/5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,#5A9BD4_0%,transparent_50%)] opacity-10" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,#E6CBB8_0%,transparent_50%)] opacity-20" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 p-12 max-w-lg"
        >
          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-[#1C365C]/5 mb-8">
            <div className="w-6 h-6 bg-[#5A9BD4] rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-[#1C365C] tracking-tight leading-[1.1] mb-6">
            Tu práctica médica,<br/>en un solo lugar.
          </h1>
          <p className="text-xl text-[#1C365C]/60 font-medium">
            Gestiona tu agenda, pacientes y consultas con la plataforma más confiable.
          </p>
        </motion.div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative">
        <button 
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 sm:left-12 p-3 bg-[#FDF9F3] text-[#1C365C] hover:bg-[#1C365C]/5 rounded-xl transition-colors hidden md:block"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-[#1C365C] tracking-tight mb-2">Bienvenido de nuevo</h2>
            <p className="text-[#1C365C]/60 font-medium">Ingresa tus credenciales para continuar.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest pl-1">Correo Electrónico</label>
              <input
                type="email"
                placeholder="ejemplo@medifind.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 bg-[#FDF9F3] border border-[#1C365C]/5 rounded-2xl px-5 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest pl-1">Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 bg-[#FDF9F3] border border-[#1C365C]/5 rounded-2xl px-5 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all outline-none"
              />
            </div>
            
            <Button type="submit" className="w-full h-14 bg-[#1C365C] text-white hover:bg-[#2C466C] active:scale-95 transition-all text-lg font-bold rounded-2xl shadow-lg mt-4 flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" />
              Iniciar Sesión
            </Button>
          </form>

          <p className="mt-10 text-center text-sm font-medium text-[#1C365C]/60">
            ¿No tienes cuenta?{' '}
            <button 
              onClick={() => navigate('/registro')}
              className="font-bold text-[#5A9BD4] hover:text-[#4A8BC4] transition-colors"
            >
              Regístrate aquí
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
