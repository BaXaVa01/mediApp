import type { Doctor } from '../types/doctor';
import type { Clinic } from '../types/clinic';

export const mockDoctors: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Alejandro Martínez',
    specialty: 'Cardiología',
    bio: 'Especialista en cardiología preventiva con más de 10 años de experiencia.',
    rating: 4.8,
    reviewCount: 124,
    price: 80,
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200',
    location: { lat: 12.1364, lng: -86.2514, address: 'Bolonia, Managua' },
    locations: [{ lat: 12.1364, lng: -86.2514, address: 'Bolonia, Managua' }],
    availability: ['Lunes', 'Miércoles', 'Viernes'],
    availabilityPreview: [
      { date: 'Hoy', time: '14:00' },
      { date: 'Mañana', time: '09:00' },
      { date: 'Jue, 12', time: '11:30' }
    ],
    consultationTypes: ['Presencial', 'En línea'],
    insurance: ['MetLife', 'AXA'],
    titles: ['Médico Cirujano (UNAM)', 'Especialidad en Cardiología (INC)'],
    experience: '15 años',
    services: ['Consulta General', 'Electrocardiograma'],
    licenseNumber: 'CMP-123456',
    diseasesTreated: ['Hipertensión', 'Arritmias', 'Insuficiencia Cardíaca'],
    patientTypes: ['Adultos', 'Adultos mayores'],
    education: ['Universidad Nacional Autónoma de México (UNAM) - Médico Cirujano', 'Instituto Nacional de Cardiología - Especialidad'],
    certifications: ['Consejo Mexicano de Cardiología'],
    languages: ['Español (Nativo)', 'Inglés (Avanzado)'],
    publications: ['Tratamiento temprano de hipertensión en adultos (Revista Médica, 2021)'],
    awards: ['Premio a la Excelencia Médica 2023'],
    servicesDetails: [
      { name: 'Consulta Cardiológica Inicial', price: 80, duration: '45 min' },
      { name: 'Electrocardiograma', price: 40, duration: '20 min' },
      { name: 'Ecocardiograma', price: 120, duration: '60 min' }
    ],
    careLocations: [
      { name: 'Consultorio Principal', address: 'Bolonia, Managua, Edificio B, Piso 2', phone: '+505 8888 1111', availability: 'Lun - Vie: 09:00 - 18:00' },
      { name: 'Hospital Vivian Pellas', address: 'Km 9.7 Carretera a Masaya', phone: '+505 2255 6666', availability: 'Sábados: 08:00 - 12:00' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400&h=300',
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=400&h=300',
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=400&h=300'
    ],
    reviews: [
      { patientName: 'Carlos M.', comment: 'Excelente atención y muy claro al explicar el diagnóstico.', rating: 5, date: '12 May 2026' },
      { patientName: 'Ana R.', comment: 'El doctor fue muy puntual y profesional.', rating: 4.5, date: '08 Abr 2026' }
    ],
    appointments: [
      { id: "a1", patientName: "Juan Pérez", time: "09:00", date: "2026-05-07", type: "Consulta", status: "Confirmada" },
      { id: "a2", patientName: "María García", time: "11:30", date: "2026-05-07", type: "Seguimiento", status: "Confirmada" },
      { id: "a3", patientName: "Pedro López", time: "16:00", date: "2026-05-07", type: "Consulta", status: "Pendiente" }
    ],
    schedule: [
      { day: 'Lunes', hours: '09:00 - 14:00, 16:00 - 18:00' },
      { day: 'Miércoles', hours: '09:00 - 14:00' },
      { day: 'Viernes', hours: '10:00 - 18:00' }
    ],
  },
  {
    id: 'd2',
    name: 'Dra. Sofía Rodríguez',
    specialty: 'Pediatría',
    bio: 'Apasionada por el cuidado de los más pequeños.',
    rating: 4.9,
    reviewCount: 89,
    price: 60,
    photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200',
    location: { lat: 12.1481, lng: -86.2721, address: 'Los Robles, Managua' },
    locations: [{ lat: 12.1481, lng: -86.2721, address: 'Los Robles, Managua' }],
    availability: ['Martes', 'Jueves', 'Sábado'],
    availabilityPreview: [
      { date: 'Hoy', time: '10:00' },
      { date: 'Mañana', time: '15:00' }
    ],
    consultationTypes: ['Presencial'],
    insurance: ['MAPFRE', 'Seguros América'],
    titles: ['Médico Cirujano (UAM)', 'Especialidad en Pediatría (HEAL)'],
    experience: '8 años',
    services: ['Control de niño sano', 'Vacunación'],
    licenseNumber: 'CMP-789012',
    diseasesTreated: ['Gripe', 'Infecciones estomacales', 'Asma infantil'],
    patientTypes: ['Niños', 'Bebés'],
    education: ['Universidad Anáhuac - Médico Cirujano', 'Hospital Infantil de México - Especialidad'],
    certifications: ['Consejo Mexicano de Pediatría'],
    languages: ['Español (Nativo)', 'Inglés (Intermedio)'],
    publications: [],
    awards: [],
    servicesDetails: [
      { name: 'Consulta Pediátrica', price: 60, duration: '30 min' },
      { name: 'Vacunación', price: 20, duration: '15 min' }
    ],
    careLocations: [
      { name: 'Clínica Infantil Los Robles', address: 'Los Robles, Managua', phone: '+505 8888 2222', availability: 'Mar, Jue, Sáb: 10:00 - 16:00' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1502740479091-635887520276?auto=format&fit=crop&q=80&w=400&h=300'
    ],
    reviews: [
      { patientName: 'Lucía G.', comment: 'Trato increíble con los niños, mi hija se sintió muy cómoda.', rating: 5, date: '20 May 2026' }
    ],
    appointments: [],
    schedule: [
      { day: 'Martes', hours: '10:00 - 16:00' },
      { day: 'Jueves', hours: '10:00 - 16:00' },
      { day: 'Sábado', hours: '09:00 - 13:00' }
    ],
  },
  {
    id: 'd3',
    name: 'Dr. Roberto Gómez',
    specialty: 'Dermatología',
    bio: 'Experto en dermatología clínica y estética.',
    rating: 4.7,
    reviewCount: 56,
    price: 70,
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200&h=200',
    location: { lat: 12.1285, lng: -86.2650, address: 'Altamira, Managua' },
    locations: [{ lat: 12.1285, lng: -86.2650, address: 'Altamira, Managua' }],
    availability: ['Lunes', 'Martes', 'Jueves'],
    availabilityPreview: [
      { date: 'Hoy', time: '11:00' },
      { date: 'Mañana', time: '16:30' }
    ],
    consultationTypes: ['Presencial', 'En línea'],
    insurance: ['Assa', 'Palic'],
    titles: ['Médico Cirujano (UNAN)', 'Especialidad en Dermatología (IMSS)'],
    experience: '12 años',
    services: ['Tratamiento de acné', 'Peeling químico'],
    licenseNumber: 'CMP-345678',
    diseasesTreated: ['Acné', 'Dermatitis', 'Cáncer de piel'],
    patientTypes: ['Jóvenes', 'Adultos'],
    education: ['UNAN Managua - Médico Cirujano', 'Centro Dermatológico Pascua - Especialidad'],
    certifications: ['Colegio Ibero-Latinoamericano de Dermatología'],
    languages: ['Español (Nativo)'],
    publications: [],
    awards: [],
    servicesDetails: [
      { name: 'Consulta Dermatológica', price: 70, duration: '30 min' },
      { name: 'Limpieza Facial Profunda', price: 50, duration: '60 min' }
    ],
    careLocations: [
      { name: 'Dermaclinic Altamira', address: 'Altamira, de la Vicky 2c al sur', phone: '+505 2270 3333', availability: 'Lun - Jue: 10:00 - 18:00' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=400&h=300'
    ],
    reviews: [
      { patientName: 'Miguel S.', comment: 'Muy profesional, mi acné ha mejorado notablemente.', rating: 5, date: '15 May 2026' }
    ],
    appointments: [],
    schedule: [
      { day: 'Lunes', hours: '10:00 - 18:00' },
      { day: 'Martes', hours: '10:00 - 18:00' },
      { day: 'Jueves', hours: '10:00 - 18:00' }
    ],
  },
  {
    id: 'd4',
    name: 'Dra. Elena Valdivia',
    specialty: 'Ginecología',
    bio: 'Salud integral para la mujer en todas sus etapas.',
    rating: 4.9,
    reviewCount: 210,
    price: 75,
    photo: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=200&h=200',
    location: { lat: 12.1120, lng: -86.2210, address: 'Carretera a Masaya, Managua' },
    locations: [{ lat: 12.1120, lng: -86.2210, address: 'Carretera a Masaya, Managua' }],
    availability: ['Lunes', 'Miércoles', 'Viernes', 'Sábado'],
    availabilityPreview: [
      { date: 'Mañana', time: '08:30' },
      { date: 'Vie, 13', time: '10:00' }
    ],
    consultationTypes: ['Presencial'],
    insurance: ['Iniser', 'Lafise'],
    titles: ['Médico Cirujano (UAM)', 'Ginecología y Obstetricia (HSJD)'],
    experience: '20 años',
    services: ['Control prenatal', 'Ultrasonido pélvico'],
    licenseNumber: 'CMP-901234',
    diseasesTreated: ['SOP', 'Endometriosis', 'Menopausia'],
    patientTypes: ['Mujeres'],
    education: ['UAM - Médico Cirujano', 'Hospital Bertha Calderón - Especialidad'],
    certifications: ['Sociedad Nicaragüense de Ginecología'],
    languages: ['Español (Nativo)', 'Francés (Básico)'],
    publications: [],
    awards: ['Ginecóloga del año 2022'],
    servicesDetails: [
      { name: 'Consulta Ginecológica', price: 75, duration: '40 min' },
      { name: 'Papanicolaou', price: 30, duration: '15 min' }
    ],
    careLocations: [
      { name: 'Centro Médico La Concha', address: 'Km 12.5 Carretera a Masaya', phone: '+505 2233 4455', availability: 'Lun - Sáb: 08:00 - 13:00' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1579154235884-332005fd80ca?auto=format&fit=crop&q=80&w=400&h=300'
    ],
    reviews: [
      { patientName: 'Elena P.', comment: 'Excelente profesional, muy humana y empática.', rating: 5, date: '10 May 2026' }
    ],
    appointments: [],
    schedule: [
      { day: 'Lunes', hours: '08:00 - 13:00' },
      { day: 'Miércoles', hours: '08:00 - 13:00' },
      { day: 'Viernes', hours: '08:00 - 13:00' },
      { day: 'Sábado', hours: '08:00 - 12:00' }
    ],
  }
];

export const mockClinics: Clinic[] = [
  {
    id: 'c1',
    name: 'Clínica Médica Santa Fe',
    bio: 'Centro hospitalario de alta especialidad.',
    logo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=200&h=200',
    rating: 4.7,
    reviewCount: 312,
    location: { lat: 12.1150, lng: -86.2360, address: 'Carretera a Masaya, Managua' },
    locations: [{ lat: 12.1150, lng: -86.2360, address: 'Carretera a Masaya, Managua' }],
    availabilityPreview: [
      { date: 'Hoy', time: '16:00' },
      { date: 'Mañana', time: '08:00' }
    ],
    consultationTypes: ['Presencial'],
    doctors: ['d1', 'd4'],
    services: ['Urgencias', 'Laboratorio', 'Rayos X'],
  },
  {
    id: 'c2',
    name: 'Centro Pediátrico Los Robles',
    bio: 'Atención integral para la infancia.',
    logo: 'https://images.unsplash.com/photo-1502740479091-635887520276?auto=format&fit=crop&q=80&w=200&h=200',
    rating: 4.9,
    reviewCount: 156,
    location: { lat: 12.1481, lng: -86.2721, address: 'Los Robles, Managua' },
    locations: [{ lat: 12.1481, lng: -86.2721, address: 'Los Robles, Managua' }],
    availabilityPreview: [
      { date: 'Mañana', time: '10:00' }
    ],
    consultationTypes: ['Presencial'],
    doctors: ['d2'],
    services: ['Vacunación', 'Crecimiento y Desarrollo'],
  }
];
