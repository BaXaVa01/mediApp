import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterDoctorForm } from '../components/forms/RegisterDoctorForm';
import { ArrowLeft, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';

const RegisterDoctorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-white">
      {/* Left Side: Brand/Visual */}
      <div className="hidden lg:flex flex-1 bg-[#FDF9F3] relative items-center justify-center overflow-hidden border-r border-[#1C365C]/5">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,#5A9BD4_0%,transparent_50%)] opacity-10" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,#E6CBB8_0%,transparent_50%)] opacity-10" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 p-12 max-w-lg"
        >
          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-[#1C365C]/5 mb-8">
            <Stethoscope className="w-8 h-8 text-[#5A9BD4]" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-[#1C365C] tracking-tight leading-[1.1] mb-6">
            Eleva tu práctica<br/>al siguiente nivel.
          </h1>
          <p className="text-xl text-[#1C365C]/60 font-medium">
            Únete a la red médica, gestiona tu agenda y conecta con más pacientes cada día.
          </p>
        </motion.div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-[1.2] flex flex-col justify-center p-6 sm:p-12 relative overflow-y-auto custom-scrollbar">
        <button 
          onClick={() => navigate('/registro')}
          className="absolute top-8 left-8 sm:left-12 p-3 bg-[#FDF9F3] text-[#1C365C] hover:bg-[#1C365C]/5 rounded-xl transition-colors hidden md:block z-20"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="w-full max-w-xl mx-auto py-12"
        >
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-[#1C365C] tracking-tight mb-2">Registro de Especialista</h2>
            <p className="text-[#1C365C]/60 font-medium">Únete a nuestra red de profesionales médicos.</p>
          </div>

          <RegisterDoctorForm />

          <p className="mt-10 text-center text-sm font-medium text-[#1C365C]/60">
            ¿Ya tienes cuenta?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="font-bold text-[#5A9BD4] hover:text-[#4A8BC4] transition-colors"
            >
              Inicia sesión aquí
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterDoctorPage;
