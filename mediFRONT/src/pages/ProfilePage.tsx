import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { useSelectedProfileStore } from '../store/selectedProfileStore';
import { useLocationStore } from '../store/locationStore';
import { profileService } from '../services/profileService';
import { mockDoctors, mockClinics } from '../utils/mockData';
import { Button } from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import type { Doctor } from '../types/doctor';
import type { Clinic } from '../types/clinic';

// Import new components
import { ProfileHero } from '../components/profile/ProfileHero';
import { DoctorExperienceCard } from '../components/profile/DoctorExperienceCard';
import { ServicesPricingCard } from '../components/profile/ServicesPricingCard';
import { CareLocationsTabs } from '../components/profile/CareLocationsTabs';
import { GalleryGrid } from '../components/profile/GalleryGrid';
import { ReviewsSection } from '../components/profile/ReviewsSection';
import { AppointmentBooking } from '../components/profile/AppointmentBooking';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const ProfilePage: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const { selectedId, selectedType, setSelected } = useSelectedProfileStore();
  const { searchResults } = useLocationStore();
  const navigate = useNavigate();

  const [apiProfile, setApiProfile] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(false);

  const activeDoctorId = doctorId || selectedId;

  // Sync route param with store state
  useEffect(() => {
    if (doctorId && doctorId !== selectedId) {
      setSelected(doctorId, 'doctor');
    }
  }, [doctorId, selectedId, setSelected]);

  useEffect(() => {
    if (!activeDoctorId || selectedType !== 'doctor') return;
    
    // Check if we have it locally first
    const localDoc = mockDoctors.find(d => d.id === activeDoctorId) || searchResults.find(d => d.id === activeDoctorId);
    if (localDoc) {
      setApiProfile(localDoc);
      return;
    }

    // Fetch from backend if not found locally
    const fetchDoc = async () => {
      setLoading(true);
      try {
        const doc = await profileService.getProfessionalById(activeDoctorId);
        setApiProfile(doc);
      } catch (err) {
        console.error('Error fetching doctor details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [activeDoctorId, selectedType, searchResults]);

  if (!activeDoctorId) {
    return <Navigate to="/buscar" replace />;
  }

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-[#5A9BD4]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current mb-4" />
        <p className="font-medium text-lg">Cargando perfil...</p>
      </div>
    );
  }

  const profile = selectedType === 'doctor' 
    ? apiProfile
    : mockClinics.find(c => c.id === activeDoctorId);

  if (!profile) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <p className="mb-4">Perfil no encontrado</p>
        <Button onClick={() => navigate('/buscar')}>Volver a buscar</Button>
      </div>
    );
  }

  const isDoctorProfile = selectedType === 'doctor';
  const doctor = isDoctorProfile ? (profile as Doctor) : null;
  const clinic = !isDoctorProfile ? (profile as Clinic) : null;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <div className="min-h-screen pb-20 bg-[#FDF9F3] selection:bg-[#5A9BD4]/30">
      {/* Header Banner */}
      <div className="h-64 bg-gradient-to-b from-[#5A9BD4]/10 to-transparent relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,#5A9BD4_0%,transparent_50%)]" />
           <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,#E6CBB8_0%,transparent_50%)]" />
        </div>
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="absolute top-24 left-6 p-3 rounded-2xl bg-white/80 backdrop-blur-md shadow-sm border border-[#1C365C]/5 hover:bg-white transition-all z-20 group"
        >
          <ArrowLeft className="h-5 w-5 text-[#1C365C] group-hover:-translate-x-1 transition-transform" />
        </motion.button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-6 -mt-24 relative z-10"
      >
        {isDoctorProfile && doctor ? (
          <div className="space-y-8">
            <motion.div variants={itemVariants}>
              <ProfileHero doctor={doctor} />
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <motion.div variants={itemVariants}>
                  <DoctorExperienceCard doctor={doctor} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <ServicesPricingCard doctor={doctor} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <CareLocationsTabs doctor={doctor} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <GalleryGrid doctor={doctor} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <ReviewsSection doctor={doctor} />
                </motion.div>
              </div>
              <div className="lg:col-span-1 self-start">
                <motion.div variants={itemVariants}>
                  <AppointmentBooking doctor={doctor} />
                </motion.div>
              </div>

            </div>
          </div>
        ) : (
          /* Clinic Fallback UI */
          <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-[#1C365C]/5 p-12">
             <div className="flex flex-col sm:flex-row gap-8 items-center mb-8 text-center sm:text-left">
                <img src={clinic?.logo} alt={clinic?.name} className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-lg" />
                <div>
                   <h1 className="text-3xl font-bold text-[#1C365C] mb-2">{clinic?.name}</h1>
                   <p className="text-[#1C365C]/60 text-lg max-w-lg">{clinic?.bio}</p>
                </div>
             </div>
             <div className="bg-[#FDF9F3]/50 rounded-2xl p-6 text-center border border-dashed border-[#1C365C]/10">
               <p className="text-sm text-[#1C365C]/50 font-medium">Perfil de clínica básico (No actualizado con nuevas secciones).</p>
             </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage;
