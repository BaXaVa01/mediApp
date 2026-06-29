import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Star, MapPin, Navigation, Video, Home, Stethoscope } from 'lucide-react';
import type { Doctor } from '../../types/doctor';
import type { Clinic } from '../../types/clinic';
import { useSelectedProfileStore } from '../../store/selectedProfileStore';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { AvailabilityPreview } from './AvailabilityPreview';

interface SearchResultCardProps {
  data: Doctor | Clinic;
  type: 'doctor' | 'clinic';
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({ data, type }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSelected, setRoutingTarget } = useSelectedProfileStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isDoctor = type === 'doctor';
  const doctor = isDoctor ? (data as Doctor) : null;
  const clinic = !isDoctor ? (data as Clinic) : null;

  const photoUrl = doctor?.photo || clinic?.logo;
  const name = doctor?.name || clinic?.name;
  const subtitle = doctor?.specialty || 'Clínica';
  const price = doctor?.price;

  const handleAction = () => {
    setSelected(data.id, type);
    if (isAuthenticated) {
      navigate('/perfil');
    } else {
      navigate('/login', { state: { from: location } });
    }
  };

  const handleShowRoute = () => {
    setRoutingTarget(data.id);
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-[0_10px_30px_rgba(28,54,92,0.05)] border border-[#1C365C]/5 p-5 flex flex-col sm:flex-row gap-6 hover:shadow-[0_20px_40px_rgba(28,54,92,0.08)] transition-all group">
      <div className="relative flex-shrink-0">
        <img
          src={photoUrl}
          alt={name}
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border border-[#1C365C]/5 shadow-sm group-hover:scale-[1.02] transition-transform"
        />
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="font-bold text-xl text-[#1C365C] tracking-tight">{name}</h3>
            <p className="text-[#5A9BD4] font-semibold text-sm">{subtitle}</p>
          </div>
          <div className="flex items-center gap-1.5 bg-[#FDF9F3] px-3 py-1.5 rounded-full text-[#1C365C] font-bold text-sm border border-[#1C365C]/5">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            {data.rating} <span className="text-xs text-[#1C365C]/40 font-normal">({data.reviewCount})</span>
          </div>
        </div>
        
        <div className="mt-4 flex flex-col gap-2.5 text-sm text-[#1C365C]/60">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#1C365C]/30 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{data.location.address}</span>
          </div>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {price !== undefined && (
              <div className="flex items-center gap-2 text-[#1C365C] font-bold">
                <div className="w-1 h-1 rounded-full bg-[#5A9BD4]" />
                <span>${price} consulta</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              {data.consultationTypes?.map((cType) => (
                <span key={cType} className="flex items-center gap-1.5 text-xs px-2.5 py-1 bg-[#FDF9F3] border border-[#1C365C]/5 rounded-full text-[#1C365C]/70">
                  {cType === 'Presencial' && <Stethoscope className="w-3 h-3" />}
                  {cType === 'En línea' && <Video className="w-3 h-3" />}
                  {cType === 'A domicilio' && <Home className="w-3 h-3" />}
                  {cType}
                </span>
              ))}
            </div>
          </div>
        </div>

        <AvailabilityPreview slots={data.availabilityPreview || []} />

        <div className="mt-6 flex flex-wrap sm:flex-nowrap gap-3 items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleShowRoute}
            className="flex-1 sm:flex-none border-[#1C365C]/10 text-[#1C365C] hover:bg-[#FDF9F3] rounded-xl font-bold h-10 px-6"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Ver ruta
          </Button>
          <Button 
            size="sm" 
            onClick={handleAction}
            className="flex-1 sm:flex-none bg-[#5A9BD4] hover:bg-[#4A8BC4] text-white rounded-xl font-bold h-10 px-8 shadow-md shadow-[#5A9BD4]/20"
          >
            Reservar Cita
          </Button>
        </div>
      </div>
    </div>
  );
};
