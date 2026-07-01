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

interface CareLocationsMapProps {
  latitude: number;
  longitude: number;
  name: string;
  address?: string;
}

export const CareLocationsMap: React.FC<CareLocationsMapProps> = ({ latitude, longitude, name, address }) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy existing map if initialized to prevent multiple maps
    if (mapRef.current) {
      mapRef.current.remove();
    }

    const map = L.map(containerRef.current).setView([latitude, longitude], 15);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const marker = L.marker([latitude, longitude], { icon: DefaultIcon })
      .addTo(map)
      .bindPopup(`<strong>${name}</strong>${address ? `<br/>${address}` : ''}`)
      .openPopup();
    
    markerRef.current = marker;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markerRef.current = null;
    };
  }, [latitude, longitude, name, address]);

  return (
    <div className="h-full w-full min-h-[220px] rounded-[1.5rem] overflow-hidden relative z-10 border border-[#1C365C]/5">
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};
