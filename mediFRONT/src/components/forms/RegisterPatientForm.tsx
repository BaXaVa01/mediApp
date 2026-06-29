import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { UserPlus } from 'lucide-react';

export const RegisterPatientForm: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', phone: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email: formData.email, password: formData.password });
    navigate('/buscar');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest pl-1">Correo Electrónico</label>
        <input
          type="email"
          placeholder="ejemplo@medifind.com"
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

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest pl-1">Teléfono (Opcional)</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full h-14 bg-[#FDF9F3] border border-[#1C365C]/5 rounded-2xl px-5 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all outline-none"
        />
      </div>

      <Button type="submit" className="w-full h-14 bg-[#1C365C] text-white hover:bg-[#2C466C] active:scale-95 transition-all text-lg font-bold rounded-2xl shadow-lg mt-4 flex items-center justify-center gap-2">
        <UserPlus className="w-5 h-5" />
        Crear Cuenta
      </Button>
    </form>
  );
};
