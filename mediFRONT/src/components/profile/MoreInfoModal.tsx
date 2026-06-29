import React from 'react';
import { X } from 'lucide-react';
import type { Doctor } from '../../types/doctor';

interface MoreInfoModalProps {
  doctor: Doctor;
  isOpen: boolean;
  onClose: () => void;
}

export const MoreInfoModal: React.FC<MoreInfoModalProps> = ({ doctor, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors z-10"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-[#1C365C] mb-6">Información Detallada</h2>
          
          <div className="space-y-6">
            <section>
              <h3 className="font-bold text-[#5A9BD4] mb-2 border-b border-[#5A9BD4]/20 pb-1">Educación</h3>
              <ul className="list-disc pl-5 text-sm text-[#4A628A] space-y-1">
                {doctor.education.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </section>

            {doctor.certifications.length > 0 && (
              <section>
                <h3 className="font-bold text-[#5A9BD4] mb-2 border-b border-[#5A9BD4]/20 pb-1">Certificaciones</h3>
                <ul className="list-disc pl-5 text-sm text-[#4A628A] space-y-1">
                  {doctor.certifications.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </section>
            )}

            <section>
              <h3 className="font-bold text-[#5A9BD4] mb-2 border-b border-[#5A9BD4]/20 pb-1">Idiomas</h3>
              <div className="flex flex-wrap gap-2">
                {doctor.languages.map((lang, i) => (
                  <span key={i} className="bg-slate-100 px-3 py-1 rounded-full text-sm text-slate-700 font-medium">{lang}</span>
                ))}
              </div>
            </section>

            {doctor.publications.length > 0 && (
              <section>
                <h3 className="font-bold text-[#5A9BD4] mb-2 border-b border-[#5A9BD4]/20 pb-1">Publicaciones</h3>
                <ul className="list-disc pl-5 text-sm text-[#4A628A] space-y-1">
                  {doctor.publications.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </section>
            )}

             {doctor.awards.length > 0 && (
              <section>
                <h3 className="font-bold text-[#5A9BD4] mb-2 border-b border-[#5A9BD4]/20 pb-1">Reconocimientos</h3>
                <ul className="list-disc pl-5 text-sm text-[#4A628A] space-y-1">
                  {doctor.awards.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </section>
            )}

            <section>
              <h3 className="font-bold text-[#5A9BD4] mb-2 border-b border-[#5A9BD4]/20 pb-1">Enfermedades Tratadas</h3>
              <div className="flex flex-wrap gap-2">
                {doctor.diseasesTreated.map((disease, i) => (
                  <span key={i} className="text-sm text-[#4A628A] bg-[#5A9BD4]/5 px-3 py-1 rounded-lg border border-[#5A9BD4]/10">{disease}</span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
