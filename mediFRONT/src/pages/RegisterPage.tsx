import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountTypeCard } from '../components/cards/AccountTypeCard';
import { User, Stethoscope, Building2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-6 bg-[#FDF9F3] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,#5A9BD4_0%,transparent_40%)] opacity-5 pointer-events-none" />

      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 p-3 bg-white text-[#1C365C] hover:bg-[#1C365C]/5 rounded-xl border border-[#1C365C]/5 shadow-sm transition-colors z-10 hidden sm:block"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-5xl relative z-10"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="w-16 h-16 bg-white rounded-3xl mx-auto flex items-center justify-center shadow-sm border border-[#1C365C]/5 mb-6">
            <div className="w-6 h-6 bg-[#5A9BD4] rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1C365C] tracking-tight mb-4">Crea tu cuenta</h1>
          <p className="text-[#1C365C]/60 text-lg font-medium max-w-lg mx-auto">Únete a MediFind. Selecciona el tipo de perfil que mejor se adapte a tus necesidades.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants}>
            <AccountTypeCard
              title="Soy Paciente"
              description="Encuentra especialistas, agenda citas y gestiona tu salud de forma simple."
              icon={<User className="w-8 h-8" />}
              to="/registro/paciente"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <AccountTypeCard
              title="Soy Especialista"
              description="Únete a la red, gestiona tus consultas y aumenta tu visibilidad."
              icon={<Stethoscope className="w-8 h-8" />}
              to="/registro/medico"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <AccountTypeCard
              title="Soy Clínica"
              description="Administra tu centro médico, especialidades y personal."
              icon={<Building2 className="w-8 h-8" />}
              to="/registro/clinica"
            />
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="mt-16 text-center text-sm font-medium text-[#1C365C]/60">
          ¿Ya tienes una cuenta?{' '}
          <button 
            onClick={() => navigate('/login')}
            className="font-bold text-[#5A9BD4] hover:text-[#4A8BC4] transition-colors"
          >
            Inicia sesión aquí
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
