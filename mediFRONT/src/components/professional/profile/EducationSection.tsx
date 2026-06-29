import { useState } from 'react';
import { useProfileStore } from '../../../store/profileStore';
import { GraduationCap, Plus, Trash2, Edit2, Loader2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import type { EducationDoctor } from '../../../types/profile';

export const EducationSection = () => {
  const { profile, addEducation, updateEducation, deleteEducation } = useProfileStore();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [formData, setFormData] = useState<Partial<EducationDoctor>>({});

  if (!profile) return null;

  const handleEdit = (edu: EducationDoctor) => {
    setFormData(edu);
    setEditingId(edu.id);
  };

  const handleAddNew = () => {
    setFormData({ title: '', institution: '', startYear: new Date().getFullYear(), endYear: null, description: '' });
    setEditingId('new');
  };

  const handleSave = async () => {
    setProcessingId('save');
    if (editingId === 'new') {
      await addEducation(formData as Omit<EducationDoctor, 'id' | 'doctorId'>);
    } else if (editingId) {
      await updateEducation(editingId, formData);
    }
    setProcessingId(null);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    setProcessingId(id);
    await deleteEducation(id);
    setProcessingId(null);
  };

  const renderForm = () => (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="p-6 bg-white rounded-[1.5rem] border border-[#5A9BD4]/30 shadow-md space-y-4 mb-4 overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Título / Grado</label>
          <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#FDF9F3] border border-[#1C365C]/5 rounded-xl py-2 px-3 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Institución</label>
          <input type="text" value={formData.institution || ''} onChange={e => setFormData({...formData, institution: e.target.value})} className="w-full bg-[#FDF9F3] border border-[#1C365C]/5 rounded-xl py-2 px-3 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Año Inicio</label>
          <input type="number" value={formData.startYear || ''} onChange={e => setFormData({...formData, startYear: parseInt(e.target.value)})} className="w-full bg-[#FDF9F3] border border-[#1C365C]/5 rounded-xl py-2 px-3 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Año Fin (Vacío si actual)</label>
          <input type="number" value={formData.endYear || ''} onChange={e => setFormData({...formData, endYear: e.target.value ? parseInt(e.target.value) : null})} placeholder="Presente" className="w-full bg-[#FDF9F3] border border-[#1C365C]/5 rounded-xl py-2 px-3 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 outline-none" />
        </div>
        <div className="md:col-span-2 space-y-1">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Descripción (Opcional)</label>
          <textarea rows={2} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#FDF9F3] border border-[#1C365C]/5 rounded-xl py-2 px-3 text-sm font-medium text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 outline-none resize-none custom-scrollbar" />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={() => setEditingId(null)} disabled={processingId === 'save'} className="border-[#1C365C]/10 text-[#1C365C] rounded-xl font-bold">Cancelar</Button>
        <Button onClick={handleSave} disabled={processingId === 'save'} className="bg-[#5A9BD4] text-white hover:bg-[#4A8BC4] rounded-xl font-bold flex items-center gap-2">
          {processingId === 'save' && <Loader2 className="w-4 h-4 animate-spin" />} Guardar
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className="bg-white rounded-[2rem] border border-[#1C365C]/5 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#1C365C]/5">
        <div>
          <h3 className="text-xl font-bold text-[#1C365C]">Formación Académica</h3>
          <p className="text-sm font-medium text-[#1C365C]/60 mt-1">Tus grados, especialidades y certificaciones.</p>
        </div>
        <Button onClick={handleAddNew} disabled={editingId !== null} className="bg-[#5A9BD4]/10 text-[#5A9BD4] hover:bg-[#5A9BD4]/20 px-4 h-10 rounded-xl font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Añadir
        </Button>
      </div>

      {profile.education.length === 0 && editingId !== 'new' ? (
        <div className="text-center py-8">
          <GraduationCap className="w-8 h-8 text-[#1C365C]/20 mx-auto mb-3" />
          <p className="text-sm font-bold text-[#1C365C]/40 uppercase tracking-widest">Sin registros</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {editingId === 'new' && <div key="new">{renderForm()}</div>}
            {profile.education.map(edu => (
              editingId === edu.id ? (
                <div key={edu.id}>{renderForm()}</div>
              ) : (
                <motion.div 
                  key={edu.id}
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  className="p-5 bg-[#FDF9F3]/50 rounded-2xl border border-[#1C365C]/5 flex justify-between items-start group hover:border-[#1C365C]/10 transition-all overflow-hidden"
                >
                  <div>
                    <h4 className="font-bold text-[#1C365C] text-lg">{edu.title}</h4>
                    <p className="text-sm font-bold text-[#5A9BD4] mb-1">{edu.institution}</p>
                    <p className="text-xs font-medium text-[#1C365C]/60 mb-2">{edu.startYear} - {edu.endYear || 'Presente'}</p>
                    {edu.description && <p className="text-sm text-[#1C365C]/60">{edu.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(edu)}
                      disabled={editingId !== null}
                      className="p-2 text-[#1C365C]/40 hover:text-[#5A9BD4] hover:bg-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(edu.id)}
                      disabled={processingId === edu.id || editingId !== null}
                      className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {processingId === edu.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};