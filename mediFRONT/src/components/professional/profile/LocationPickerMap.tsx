import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface LocationPickerMapProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
}

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({ latitude, longitude, onChange }) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const defaultLat = latitude !== null ? latitude : 12.115;
    const defaultLng = longitude !== null ? longitude : -86.236;

    const map = L.map(containerRef.current).setView([defaultLat, defaultLng], 13);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    if (latitude !== null && longitude !== null) {
      const marker = L.marker([latitude, longitude], { icon: DefaultIcon }).addTo(map);
      markerRef.current = marker;
    }

    map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        const marker = L.marker([lat, lng], { icon: DefaultIcon }).addTo(map);
        markerRef.current = marker;
      }

      onChange(lat, lng);
    });

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (latitude !== null && longitude !== null) {
      const latlng: L.LatLngExpression = [latitude, longitude];
      if (markerRef.current) {
        markerRef.current.setLatLng(latlng);
      } else {
        const marker = L.marker(latlng, { icon: DefaultIcon }).addTo(map);
        markerRef.current = marker;
      }
    } else {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    }
  }, [latitude, longitude]);

  return (
    <div className="h-[250px] w-full rounded-2xl overflow-hidden border border-[#1C365C]/10 shadow-sm relative z-20">
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-[#1C365C]/5 text-[9px] font-bold text-[#1C365C] pointer-events-none z-[1000]">
        Haz clic en el mapa para marcar la ubicación exacta
      </div>
    </div>
  );
};
