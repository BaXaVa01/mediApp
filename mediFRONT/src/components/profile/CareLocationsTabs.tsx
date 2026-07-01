import React, { useState, useEffect } from 'react';
import type { Doctor } from '../../types/doctor';
import { MapPin, Phone, Clock, Navigation, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { doctorLocationService } from '../../services/DoctorLocationService';
import type { DoctorLocationDTO } from '../../services/DoctorLocationService';
import { CareLocationsMap } from './CareLocationsMap';

export const CareLocationsTabs: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [locations, setLocations] = useState<DoctorLocationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchLocs = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await doctorLocationService.getDoctorLocations(doctor.id);
        const activeLocs = (data || []).filter(l => l.active);
        setLocations(activeLocs);
      } catch (err) {
        console.error('Error loading locations for tabs:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchLocs();
  }, [doctor.id]);

  // Use loaded locations as primary, fallback to doctor.careLocations
  const hasLoadedLocations = locations.length > 0;
  const hasFallbackLocations = doctor.careLocations && doctor.careLocations.length > 0;

  if (loading) {
    return (
      <div className="bg-white rounded-[2.5rem] shadow-[0_10px_30px_rgba(28,54,92,0.03)] border border-[#1C365C]/5 p-8 flex justify-center items-center text-[#5A9BD4]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!hasLoadedLocations && !hasFallbackLocations) {
    return (
      <div className="bg-white rounded-[2.5rem] shadow-[0_10px_30px_rgba(28,54,92,0.03)] border border-[#1C365C]/5 p-8 text-center text-[#1C365C]/40 font-medium">
        Este doctor aún no tiene lugares de atención configurados.
      </div>
    );
  }

  // Active Location selection
  const activeLocName = hasLoadedLocations ? locations[activeTab]?.name : doctor.careLocations[activeTab]?.name;
  const activeLocAddress = hasLoadedLocations ? locations[activeTab]?.address || '' : doctor.careLocations[activeTab]?.address || '';
  const activeLocPhone = hasLoadedLocations ? '' : doctor.careLocations[activeTab]?.phone || '';
  const activeLocAvailability = hasLoadedLocations ? '' : doctor.careLocations[activeTab]?.availability || '';
  const activeLocCity = hasLoadedLocations ? locations[activeTab]?.city || '' : '';
  const activeLocIsMain = hasLoadedLocations ? locations[activeTab]?.isMain : false;

  const lat = hasLoadedLocations ? locations[activeTab]?.latitude : null;
  const lng = hasLoadedLocations ? locations[activeTab]?.longitude : null;
  const hasCoordinates = lat !== null && lat !== undefined && lng !== null && lng !== undefined;

  const tabsList = hasLoadedLocations ? locations : doctor.careLocations;

  const handleOpenExternalMap = () => {
    if (hasCoordinates && lat !== null && lng !== null) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeLocAddress)}`, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-[0_10px_30px_rgba(28,54,92,0.03)] border border-[#1C365C]/5 p-8 sm:p-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-[#1C365C] tracking-tight">Lugares de Atención</h2>
        {error && (
          <span className="text-[10px] text-red-500 font-bold bg-red-50 px-2.5 py-1 rounded-lg">
            Usando datos locales de respaldo
          </span>
        )}
      </div>
      
      <div className="flex overflow-x-auto gap-3 mb-8 pb-2 scrollbar-hide">
        {tabsList.map((l, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`whitespace-nowrap px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 border-2 ${
              activeTab === i 
                ? 'bg-[#1C365C] text-white border-[#1C365C] shadow-lg shadow-[#1C365C]/20 scale-105' 
                : 'bg-[#FDF9F3] text-[#1C365C]/50 border-transparent hover:bg-[#FDF9F3]/70 hover:text-[#1C365C]'
            }`}
          >
            {l.name}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-8 bg-[#FDF9F3]/50 p-6 sm:p-8 rounded-[2rem] border border-[#1C365C]/5">
        <div className="space-y-6 text-sm text-[#1C365C]/70">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-[#5A9BD4]/10 rounded-xl">
              <MapPin className="w-5 h-5 text-[#5A9BD4] shrink-0" />
            </div>
            <div className="flex flex-col mt-0.5">
               <span className="font-bold text-[#1C365C]/40 text-[10px] uppercase tracking-widest mb-1 flex items-center gap-1.5">
                 Dirección
                 {activeLocIsMain && (
                   <span className="bg-[#5A9BD4]/10 text-[#5A9BD4] text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded">Principal</span>
                 )}
               </span>
               <p className="font-semibold text-[#1C365C]">{activeLocAddress} {activeLocCity ? `(${activeLocCity})` : ''}</p>
            </div>
          </div>
          
          {activeLocAvailability && (
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-[#5A9BD4]/10 rounded-xl">
                <Clock className="w-5 h-5 text-[#5A9BD4] shrink-0" />
              </div>
              <div className="flex flex-col mt-0.5">
                 <span className="font-bold text-[#1C365C]/40 text-[10px] uppercase tracking-widest mb-1">Horarios</span>
                 <p className="font-semibold text-[#1C365C]">{activeLocAvailability}</p>
              </div>
            </div>
          )}

          {activeLocPhone && (
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-[#5A9BD4]/10 rounded-xl">
                <Phone className="w-5 h-5 text-[#5A9BD4] shrink-0" />
              </div>
              <div className="flex flex-col mt-0.5">
                 <span className="font-bold text-[#1C365C]/40 text-[10px] uppercase tracking-widest mb-1">Teléfono</span>
                 <p className="font-semibold text-[#1C365C]">{activeLocPhone}</p>
              </div>
            </div>
          )}

          <Button 
            variant="outline" 
            onClick={handleOpenExternalMap}
            className="w-full mt-4 gap-2 border-[#1C365C]/10 text-[#1C365C] font-bold h-12 rounded-xl hover:bg-white transition-all shadow-sm"
          >
            <Navigation className="w-4 h-4 text-[#5A9BD4]" /> Ver indicaciones
          </Button>
        </div>

        {/* Map Rendering Panel */}
        <div className="bg-[#1C365C]/5 rounded-[1.5rem] flex flex-col items-center justify-center min-h-[220px] text-[#1C365C]/30 relative overflow-hidden group border border-[#1C365C]/5">
          {hasCoordinates && lat !== null && lng !== null ? (
            <CareLocationsMap 
              latitude={lat}
              longitude={lng}
              name={activeLocName || 'Consultorio'}
              address={activeLocAddress}
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-[#1C365C]/5 to-transparent pointer-events-none" />
              <MapPin className="w-10 h-10 opacity-30 mb-3 group-hover:scale-110 transition-transform duration-500 text-[#1C365C]" />
              <span className="text-[10px] uppercase font-black tracking-widest opacity-60 text-center px-4">
                {hasLoadedLocations 
                  ? "Este lugar aún no tiene coordenadas configuradas en el mapa." 
                  : "Usando ubicaciones de demostración local."}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
