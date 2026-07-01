import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { Button } from '../ui/Button';
import { Stethoscope, CheckCircle } from 'lucide-react';

export const RegisterDoctorForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({ fullName: '', professionalName: '', ubication: '', specialty: '', phone: '', email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState('');

  const validateEmail = (val: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setFieldErrors({});
    setSuccessMsg('');

    if (!formData.fullName.trim()) {
      setFieldErrors(prev => ({ ...prev, fullName: 'El nombre es obligatorio.' }));
      return;
    }

    if (!formData.professionalName.trim()) {
      setFieldErrors(prev => ({ ...prev, professionalName: 'El nombre profesional es obligatorio.' }));
      return;
    }

    if (!formData.email.trim()) {
      setFieldErrors(prev => ({ ...prev, email: 'El correo electrónico es obligatorio.' }));
      return;
    }

    if (!validateEmail(formData.email)) {
      setFieldErrors(prev => ({ ...prev, email: 'El formato de correo no es válido.' }));
      return;
    }

    if (!formData.password) {
      setFieldErrors(prev => ({ ...prev, password: 'La contraseña es obligatoria.' }));
      return;
    }

    if (formData.password.length < 8) {
      setFieldErrors(prev => ({ ...prev, password: 'La contraseña debe tener mínimo 8 caracteres.' }));
      return;
    }

    try {
      await register({
        accountType: 'DOCTOR',
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        professionalName: formData.professionalName,
        bio: '',
        specialtyIds: [],
      });

      setSuccessMsg('Cuenta creada correctamente. Iniciá sesión.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      console.error('Registration error details:', err);
      if (err.code === 'EMAIL_ALREADY_EXISTS') {
        setFieldErrors(prev => ({ ...prev, email: 'El correo electrónico ya está registrado.' }));
      } else if (err.code === 'VALIDATION_ERROR' && err.fields) {
        const backendFields = { ...err.fields };
        if (backendFields.name) {
          backendFields.fullName = backendFields.name;
        }
        setFieldErrors(backendFields);
      } else if (err.code === 'NETWORK_ERROR') {
        setErrorMsg('Error de red. No se pudo establecer conexión con el servidor.');
      } else {
        setErrorMsg(err.message || 'Error al crear la cuenta. Inténtalo de nuevo.');
      }
    }
  };

  if (successMsg) {
    return (
      <div className="p-8 bg-green-50 border border-green-100 rounded-3xl text-center flex flex-col items-center justify-center space-y-4">
        <CheckCircle className="w-16 h-16 text-green-500 animate-bounce" />
        <h3 className="text-2xl font-bold text-green-800">¡Registro Exitoso!</h3>
        <p className="text-green-700 font-medium">{successMsg}</p>
        <Button onClick={() => navigate('/login')} className="bg-[#1C365C] text-white hover:bg-[#2C466C] px-6 rounded-xl font-bold mt-4">
          Ir al Login
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest pl-1">Nombre Completo</label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className={`w-full h-14 bg-[#FDF9F3] border ${fieldErrors.fullName ? 'border-red-500' : 'border-[#1C365C]/5'} rounded-2xl px-5 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all outline-none`}
          />
          {fieldErrors.fullName && <p className="text-xs text-red-500 font-bold mt-1">{fieldErrors.fullName}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest pl-1">Nombre Profesional</label>
          <input
            type="text"
            required
            placeholder="Ej: Dr. Juan Pérez"
            value={formData.professionalName}
            onChange={(e) => setFormData({ ...formData, professionalName: e.target.value })}
            className={`w-full h-14 bg-[#FDF9F3] border ${fieldErrors.professionalName ? 'border-red-500' : 'border-[#1C365C]/5'} rounded-2xl px-5 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all outline-none`}
          />
          {fieldErrors.professionalName && <p className="text-xs text-red-500 font-bold mt-1">{fieldErrors.professionalName}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest pl-1">Especialidad Principal (Informativo)</label>
          <input
            type="text"
            required
            value={formData.specialty}
            onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
            className={`w-full h-14 bg-[#FDF9F3] border ${fieldErrors.specialty ? 'border-red-500' : 'border-[#1C365C]/5'} rounded-2xl px-5 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all outline-none`}
          />
          {fieldErrors.specialty && <p className="text-xs text-red-500 font-bold mt-1">{fieldErrors.specialty}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest pl-1">Ubicación de Trabajo (Informativo)</label>
          <input
            type="text"
            required
            value={formData.ubication}
            onChange={(e) => setFormData({ ...formData, ubication: e.target.value })}
            className={`w-full h-14 bg-[#FDF9F3] border ${fieldErrors.ubication ? 'border-red-500' : 'border-[#1C365C]/5'} rounded-2xl px-5 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all outline-none`}
          />
          {fieldErrors.ubication && <p className="text-xs text-red-500 font-bold mt-1">{fieldErrors.ubication}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest pl-1">Teléfono</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={`w-full h-14 bg-[#FDF9F3] border ${fieldErrors.phone ? 'border-red-500' : 'border-[#1C365C]/5'} rounded-2xl px-5 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all outline-none`}
          />
          {fieldErrors.phone && <p className="text-xs text-red-500 font-bold mt-1">{fieldErrors.phone}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest pl-1">Correo Electrónico</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full h-14 bg-[#FDF9F3] border ${fieldErrors.email ? 'border-red-500' : 'border-[#1C365C]/5'} rounded-2xl px-5 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all outline-none`}
          />
          {fieldErrors.email && <p className="text-xs text-red-500 font-bold mt-1">{fieldErrors.email}</p>}
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
          className={`w-full h-14 bg-[#FDF9F3] border ${fieldErrors.password ? 'border-red-500' : 'border-[#1C365C]/5'} rounded-2xl px-5 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all outline-none`}
        />
        {fieldErrors.password && <p className="text-xs text-red-500 font-bold mt-1">{fieldErrors.password}</p>}
      </div>

      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full h-14 bg-[#1C365C] text-white hover:bg-[#2C466C] active:scale-95 transition-all text-lg font-bold rounded-2xl shadow-lg mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Stethoscope className="w-5 h-5" />
        )}
        {isLoading ? 'Creando cuenta...' : 'Crear Cuenta de Especialista'}
      </Button>
    </form>
  );
};


