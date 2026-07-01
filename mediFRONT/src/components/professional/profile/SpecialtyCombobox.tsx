import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Loader2, AlertCircle } from 'lucide-react';
import type { SpecialtyOption } from '../../../types/profile';

interface SpecialtyComboboxProps {
  specialties: SpecialtyOption[];
  selectedSpecialtyId: string | null | undefined;
  selectedSpecialtyName: string;
  loading: boolean;
  error: string | null;
  onSelect: (specialty: SpecialtyOption) => void;
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export const SpecialtyCombobox: React.FC<SpecialtyComboboxProps> = ({
  specialties,
  selectedSpecialtyId,
  selectedSpecialtyName,
  loading,
  error,
  onSelect
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSpecialties = specialties.filter(s =>
    normalizeText(s.name).includes(normalizeText(searchTerm))
  );

  const displayValue = selectedSpecialtyName || 'Sin especialidad principal';

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest flex justify-between mb-2">
        <span>Especialidad Principal</span>
        {loading && <span className="text-[#5A9BD4] flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Cargando...</span>}
      </label>

      {error ? (
        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>No pudimos cargar las especialidades. Especialidad actual: <strong>{displayValue}</strong></span>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => !loading && setIsOpen(!isOpen)}
            disabled={loading}
            className="w-full bg-[#FDF9F3] border border-[#1C365C]/5 rounded-xl py-3 px-4 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all flex items-center justify-between text-left disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className={selectedSpecialtyId ? 'text-[#1C365C]' : 'text-[#1C365C]/40'}>
              {displayValue}
            </span>
            <ChevronDown className={`w-4 h-4 text-[#1C365C]/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute z-[2000] w-full mt-2 bg-white border border-[#1C365C]/10 rounded-2xl shadow-xl overflow-hidden max-h-[300px] flex flex-col">
              <div className="p-2 border-b border-[#1C365C]/5 flex items-center gap-2 bg-[#FDF9F3]/50">
                <Search className="w-4 h-4 text-[#1C365C]/30 shrink-0" />
                <input
                  type="text"
                  placeholder="Buscar especialidad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent border-none text-sm font-semibold text-[#1C365C] placeholder-[#1C365C]/30 outline-none py-1.5"
                  autoFocus
                />
              </div>

              <div className="overflow-y-auto custom-scrollbar flex-1 py-1">
                {filteredSpecialties.length === 0 ? (
                  <div className="p-4 text-center text-xs text-[#1C365C]/40 font-bold uppercase tracking-wider">
                    No encontramos coincidencias.
                  </div>
                ) : (
                  filteredSpecialties.map((spec) => {
                    const isSelected = selectedSpecialtyId === spec.id;
                    return (
                      <button
                        key={spec.id}
                        type="button"
                        onClick={() => {
                          onSelect(spec);
                          setIsOpen(false);
                          setSearchTerm('');
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                          isSelected 
                            ? 'bg-[#5A9BD4]/10 text-[#1C365C] font-bold' 
                            : 'hover:bg-[#FDF9F3]/50 text-[#1C365C]/80 font-medium'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span>{spec.name}</span>
                          {spec.description && (
                            <span className="text-[10px] text-[#1C365C]/40 font-normal mt-0.5 line-clamp-1">
                              {spec.description}
                            </span>
                          )}
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#5A9BD4] shrink-0 ml-2" />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
