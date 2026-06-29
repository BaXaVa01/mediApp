import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { Stethoscope } from 'lucide-react';

export const RegisterDoctorForm: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({ fullName: '', professionalName: '', ubication: '', specialty: '', phone: '', email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email: formData.email, password: formData.password });
    navigate('/pro/agenda');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest pl-1">Nombre Completo</label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full h-14 bg-[#FDF9F3] border border-[#1C365C]/5 rounded-2xl px-5 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest pl-1">Nombre Profesional</label>
          <input
            type="text"
            required
            placeholder="Ej: Dr. Juan Pérez"
            value={formData.professionalName}
            onChange={(e) => setFormData({ ...formData, professionalName: e.target.value })}
            className="w-full h-14 bg-[#FDF9F3] border border-[#1C365C]/5 rounded-2xl px-5 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest pl-1">Especialidad Principal</label>
          <input
            type="text"
            required
            value={formData.specialty}
            onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
            className="w-full h-14 bg-[#FDF9F3] border border-[#1C365C]/5 rounded-2xl px-5 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest pl-1">Ubicación de Trabajo</label>
          <input
            type="text"
            required
            value={formData.ubication}
            onChange={(e) => setFormData({ ...formData, ubication: e.target.value })}
            className="w-full h-14 bg-[#FDF9F3] border border-[#1C365C]/5 rounded-2xl px-5 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest pl-1">Teléfono</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full h-14 bg-[#FDF9F3] border border-[#1C365C]/5 rounded-2xl px-5 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest pl-1">Correo Electrónico</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full h-14 bg-[#FDF9F3] border border-[#1C365C]/5 rounded-2xl px-5 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all outline-none"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest pl-1">Contraseña</label>
        <input
          type="password"
          placeholder="••••••••"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full h-14 bg-[#FDF9F3] border border-[#1C365C]/5 rounded-2xl px-5 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all outline-none"
        />
      </div>

      <Button type="submit" className="w-full h-14 bg-[#1C365C] text-white hover:bg-[#2C466C] active:scale-95 transition-all text-lg font-bold rounded-2xl shadow-lg mt-4 flex items-center justify-center gap-2">
        <Stethoscope className="w-5 h-5" />
        Crear Cuenta de Especialista
      </Button>
    </form>
  );
};
