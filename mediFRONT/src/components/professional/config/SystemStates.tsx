import React from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const EmptyState: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center bg-[#FDF9F3]/50 rounded-[2.5rem] border border-[#1C365C]/5">
    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-[#1C365C]/5 mb-6 text-[#1C365C]/30">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-[#1C365C] mb-2">{title}</h3>
    <p className="text-[#1C365C]/50 font-medium max-w-sm">{description}</p>
  </div>
);

export const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-20">
    <Loader2 className="w-8 h-8 text-[#5A9BD4] animate-spin mb-4" />
    <p className="text-[#1C365C]/50 font-medium tracking-tight">Cargando configuración...</p>
  </div>
);

export const ErrorState: React.FC<{ message: string, onRetry: () => void }> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center bg-rose-50/50 rounded-[2.5rem] border border-rose-100">
    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-rose-100 mb-6 text-rose-400">
      <AlertCircle className="w-8 h-8" />
    </div>
    <h3 className="text-xl font-bold text-[#1C365C] mb-2">Error al cargar</h3>
    <p className="text-rose-500 font-medium max-w-sm mb-6">{message}</p>
    <button onClick={onRetry} className="px-6 py-2 bg-white rounded-xl shadow-sm text-[#1C365C] font-bold border border-[#1C365C]/5 hover:bg-slate-50 transition-colors">
      Reintentar
    </button>
  </div>
);

export const SaveToast: React.FC<{ visible: boolean }> = ({ visible }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 50, scale: visible ? 1 : 0.9 }}
    className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#1C365C] text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl z-[500] pointer-events-none"
  >
    <CheckCircle2 className="w-5 h-5 text-[#A3C9A8]" />
    <span className="font-bold text-sm tracking-tight">Cambios guardados exitosamente</span>
  </motion.div>
);