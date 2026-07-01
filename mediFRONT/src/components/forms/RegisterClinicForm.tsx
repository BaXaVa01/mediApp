import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { Button } from '../ui/Button';
import { Building2 } from 'lucide-react';

export const RegisterClinicForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ clinicName: '', doctorsCount: '', city: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/doctor/calendar');
    } catch (err) {
      console.error('Mock clinic login error:', err);
      navigate('/doctor/calendar');
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest pl-1">Nombre de la Clínica</label>
        <input
          type="text"
          required
          value={formData.clinicName}
          onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
          className="w-full h-14 bg-[#FDF9F3] border border-[#1C365C]/5 rounded-2xl px-5 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest pl-1">Número de Médicos</label>
          <input
            type="number"
            required
            value={formData.doctorsCount}
            onChange={(e) => setFormData({ ...formData, doctorsCount: e.target.value })}
            className="w-full h-14 bg-[#FDF9F3] border border-[#1C365C]/5 rounded-2xl px-5 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest pl-1">Ciudad</label>
          <input
            type="text"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full h-14 bg-[#FDF9F3] border border-[#1C365C]/5 rounded-2xl px-5 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest pl-1">Correo Electrónico</label>
        <input
          type="email"
          placeholder="contacto@clinica.com"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full h-14 bg-[#FDF9F3] border border-[#1C365C]/5 rounded-2xl px-5 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all outline-none"
        />
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
        <Building2 className="w-5 h-5" />
        Crear Cuenta de Clínica
      </Button>
    </form>
  );
};