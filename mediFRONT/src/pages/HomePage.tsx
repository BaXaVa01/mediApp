import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Shield, Zap, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useLocationStore } from '../store/locationStore';
import { getUserLocation } from '../services/locationService';
import { profileService } from '../services/profileService';
import type { Doctor } from '../types/doctor';
import { SearchResultCard } from '../components/cards/SearchResultCard';
import homePageOnBackground from '../assets/homepage.png';
import doctor from '../assets/doctor.png';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const setUserCoords = useLocationStore((state) => state.setUserCoords);
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');

  const [results, setResults] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUserLocation((coords) => {
      setUserCoords(coords);
    });
  }, [setUserCoords]);

  // Debounce search effect for instant feedback on HomePage
  useEffect(() => {
    const trimmed = specialty.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const data = await profileService.searchProfessionals(trimmed);
        setResults(data);
      } catch (err: any) {
        setError(err.message || 'No se pudo realizar la búsqueda. Intentá de nuevo.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [specialty]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/buscar?query=${encodeURIComponent(specialty)}&loc=${encodeURIComponent(location)}`);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
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
        ease: "easeOut"
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#FDF9F3] text-[#1C365C] selection:bg-[#5A9BD4]/30">
      {/* Hero Section */}
      <section className="relative min-h-[80dvh] flex items-center overflow-hidden pt-12 pb-20">
        <div className="container mx-auto px-6 z-10">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col lg:flex-row items-center gap-16"
          >
            {/* Left Side: Content */}
            <div className="flex-[1.2] text-left">
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5A9BD4]/10 text-[#5A9BD4] text-xs font-bold tracking-wider uppercase mb-8">
                <Star className="w-3 h-3 fill-current" />
                <span>La Red Médica más Confiable</span>
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1] tracking-tighter text-[#1C365C]"
              >
                Tu salud merece al <br />
                <span className="text-[#5A9BD4]">especialista ideal.</span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-xl md:text-2xl mb-12 text-[#1C365C]/70 max-w-2xl leading-relaxed"
              >
                Reserva citas médicas con los mejores profesionales de forma rápida, segura y humana.
              </motion.p>

              <motion.div variants={itemVariants}>
                <form 
                  onSubmit={handleSearch}
                  className="bg-white p-2 rounded-3xl shadow-[0_20px_50px_rgba(28,54,92,0.1)] border border-[#1C365C]/5 flex flex-col md:flex-row gap-2 w-full max-w-3xl group"
                >
                  <div className="flex-1 relative flex items-center">
                    <Search className="absolute left-6 text-[#1C365C]/30 w-5 h-5 transition-colors group-focus-within:text-[#5A9BD4]" />
                    <Input
                      type="text"
                      placeholder="¿Qué especialidad buscas?"
                      className="pl-14 border-none bg-transparent text-[#1C365C] placeholder:text-[#1C365C]/40 h-16 focus-visible:ring-0 shadow-none text-lg"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                    />
                  </div>
                  <div className="hidden md:block w-px h-10 bg-[#1C365C]/10 self-center" />
                  <div className="flex-1 relative flex items-center">
                    <MapPin className="absolute left-6 text-[#1C365C]/30 w-5 h-5 transition-colors group-focus-within:text-[#5A9BD4]" />
                    <Input
                      type="text"
                      placeholder="Ciudad o zona"
                      className="pl-14 border-none bg-transparent text-[#1C365C] placeholder:text-[#1C365C]/40 h-16 focus-visible:ring-0 shadow-none text-lg"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="h-16 px-10 bg-[#5A9BD4] text-white hover:bg-[#4A8BC4] active:scale-95 transition-all text-lg font-bold rounded-2xl shadow-lg shadow-[#5A9BD4]/20"
                  >
                    Buscar
                  </Button>
                </form>
                {specialty.trim().length >= 2 && (
                  <div className="mt-6 bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-[#1C365C]/5 shadow-xl max-w-3xl w-full flex flex-col gap-4 relative z-50">
                    {loading && (
                      <div className="flex items-center justify-center py-8 text-[#5A9BD4]">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current mr-3" />
                        <span className="font-semibold text-lg">Buscando especialistas...</span>
                      </div>
                    )}
                    
                    {!loading && error && (
                      <div className="text-center py-6 text-red-500 font-medium">
                        No se pudo realizar la búsqueda. Intentá de nuevo.
                      </div>
                    )}
                    
                    {!loading && !error && results.length === 0 && (
                      <div className="text-center py-8 text-[#1C365C]/60 font-medium">
                        No encontramos doctores para esa especialidad.
                      </div>
                    )}
                    
                    {!loading && !error && results.length > 0 && (
                      <>
                        <div className="text-xs uppercase tracking-wider text-[#1C365C]/50 font-bold mb-1">
                          Resultados sugeridos
                        </div>
                        <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                          {results.slice(0, 3).map((doc) => (
                            <SearchResultCard key={doc.id} data={doc} type="doctor" />
                          ))}
                        </div>
                        {results.length > 3 && (
                          <button
                            type="button"
                            onClick={handleSearch}
                            className="mt-2 text-center text-[#5A9BD4] font-bold hover:underline w-full py-2"
                          >
                            Ver los {results.length} resultados completos →
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Side: Illustration */}
            <motion.div 
              variants={itemVariants}
              className="flex-1 hidden lg:block relative"
            >
              <div className="absolute -inset-4 bg-[#5A9BD4]/10 rounded-full blur-3xl" />
              <img 
                src={homePageOnBackground} 
                alt="MediFind Illustration" 
                className="relative w-full h-auto object-contain max-h-[600px] drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bento Benefits Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Experiencia médica simplificada</h2>
            <p className="text-xl text-[#1C365C]/60 leading-relaxed">
              Diseñamos MediFind para eliminar las barreras entre tú y tu bienestar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-2 row-span-1 bg-[#FDF9F3] p-12 rounded-[2.5rem] flex flex-col justify-between group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                <Calendar className="w-64 h-64 -rotate-12" />
              </div>
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#5A9BD4] flex items-center justify-center mb-8 shadow-lg shadow-[#5A9BD4]/20 text-white">
                  <Calendar className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Agenda en segundos</h3>
                <p className="text-lg text-[#1C365C]/70 max-w-md">
                  Olvídate de las esperas telefónicas. Reserva tu cita con un par de toques desde cualquier lugar.
                </p>
              </div>
              <div className="mt-12 flex items-center gap-2 text-[#5A9BD4] font-bold group-hover:gap-4 transition-all cursor-pointer">
                <span>Comenzar ahora</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </motion.div>

            {/* Small Card 1 */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[#1C365C] p-10 rounded-[2.5rem] text-white flex flex-col justify-between"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-[#A3C9A8]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">100% Verificados</h3>
                <p className="text-white/60 leading-relaxed">
                  Validamos cada cédula y certificación médica.
                </p>
              </div>
            </motion.div>

            {/* Small Card 2 */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[#A3C9A8]/10 p-10 rounded-[2.5rem] flex flex-col justify-between border border-[#A3C9A8]/20"
            >
              <div className="w-12 h-12 rounded-xl bg-[#A3C9A8] flex items-center justify-center mb-6 text-white">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Respuesta Real</h3>
                <p className="text-[#1C365C]/60 leading-relaxed">
                  Citas disponibles hoy mismo para urgencias.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marketing / Human Touch Section */}
      <section className="py-32 bg-[#FDF9F3]">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-24">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 relative"
          >
            <div className="absolute -inset-4 bg-[#E6CBB8]/20 rounded-[3rem] blur-2xl" />
            <img 
              src={doctor} 
              alt="Atención Médica MediFind" 
              className="relative rounded-[2.5rem] shadow-2xl w-full h-[500px] object-cover"
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight tracking-tight">Salud que se siente cercana</h2>
            <p className="text-xl mb-10 text-[#1C365C]/70 leading-relaxed">
              En MediFind creemos que la tecnología debe estar al servicio de las personas. 
              Facilitamos el acceso a una atención médica de calidad, 
              eliminando barreras y devolviéndote el control de tu tiempo.
            </p>
            
            <div className="grid grid-cols-1 gap-6">
              {[
                { title: "Red Nacional", text: "Conexión directa con clínicas de prestigio." },
                { title: "Historial Inteligente", text: "Gestiona todas tus citas en un solo lugar." },
                { title: "Recordatorios", text: "Notificaciones vía WhatsApp para tu comodidad." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-[#5A9BD4]/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#5A9BD4]" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">{item.title}</h4>
                    <p className="text-[#1C365C]/60">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Footer Section */}
      <section className="py-24 bg-[#1C365C] text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter">¿Eres profesional de la salud?</h2>
          <p className="text-xl mb-12 text-white/60 max-w-2xl mx-auto">
            Únete a la plataforma que está transformando la forma en que los pacientes encuentran a su médico.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="h-16 px-12 bg-[#5A9BD4] hover:bg-[#4A8BC4] text-lg font-bold rounded-2xl">
              Registrar mi Clínica
            </Button>
            <Button variant="outline" className="h-16 px-12 border-white/20 hover:bg-white/10 text-lg font-bold rounded-2xl text-white">
              Soy Especialista
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
