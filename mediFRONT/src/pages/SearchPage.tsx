import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { mockDoctors } from '../utils/mockData';
import { SearchResultCard } from '../components/cards/SearchResultCard';
import SearchMap from '../components/map/SearchMap';
import { useLocationStore } from '../store/locationStore';
import { getUserLocation } from '../services/locationService';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const locationQuery = searchParams.get('loc');
  const { userCoords, setUserCoords } = useLocationStore();

  useEffect(() => {
    // Automatically prompt for location when entering the search page if we don't have it
    if (!userCoords) {
      getUserLocation((coords) => {
        setUserCoords(coords);
      });
    }
  }, [userCoords, setUserCoords]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-[#FDF9F3]">
      {/* Left Side: Doctor List */}
      <div className="w-full lg:w-[40%] p-6 lg:p-10 lg:overflow-y-auto custom-scrollbar">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-[#1C365C] tracking-tight mb-2">Especialistas disponibles</h1>
          <p className="text-[#1C365C]/60 text-lg font-medium">{mockDoctors.length} resultados encontrados</p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6"
        >
          {mockDoctors.map((doctor) => (
            <motion.div key={doctor.id} variants={itemVariants}>
              <SearchResultCard data={doctor} type="doctor" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Right Side: Sticky Map */}
      <div className="w-full lg:w-[60%] h-[500px] lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 self-start">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="h-full p-4 lg:p-6"
        >
          <SearchMap doctors={mockDoctors} targetLocation={locationQuery} />
        </motion.div>
      </div>
    </div>
  );
};

export default SearchPage;
