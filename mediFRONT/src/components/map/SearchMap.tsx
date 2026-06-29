import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { MapPin, Loader2 } from 'lucide-react';
import type { Doctor } from '../../types/doctor';
import { Button } from '../ui/Button';
import { useLocationStore } from '../../store/locationStore';
import { useSelectedProfileStore } from '../../store/selectedProfileStore';
import { getUserLocation } from '../../services/locationService';

// Fix for default marker icon
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface SearchMapProps {
  doctors: Doctor[];
  targetLocation?: string | null;
}

const SearchMap: React.FC<SearchMapProps> = ({ doctors, targetLocation }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);
  const routingControl = useRef<any>(null);
  
  const { userCoords, setUserCoords } = useLocationStore();
  const { routingTarget, setRoutingTarget } = useSelectedProfileStore();
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (mapRef.current && !leafletMap.current) {
      // Initialize map - Center in Nicaragua (Managua) or user location if exists
      const initialView: [number, number] = userCoords || [12.1364, -86.2514];
      leafletMap.current = L.map(mapRef.current).setView(initialView, userCoords ? 15 : 12);

      // Using CartoDB Positron for a cleaner, Apple-like minimal aesthetic
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(leafletMap.current);

      markersLayer.current = L.layerGroup().addTo(leafletMap.current);

      // Add user marker if exists
      if (userCoords) {
        userMarkerRef.current = L.circleMarker(userCoords, {
          radius: 8,
          fillColor: '#5A9BD4',
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(leafletMap.current!)
          .bindPopup('Tu ubicación');
      }

      // Fix for rendering issues in some containers
      setTimeout(() => {
        leafletMap.current?.invalidateSize();
      }, 100);
    }

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  const findMe = () => {
    setIsLocating(true);
    getUserLocation(
      (coords) => {
        setUserCoords(coords);
        leafletMap.current?.flyTo(coords, 15);
        
        // Remove old marker if exists
        if (userMarkerRef.current) {
          userMarkerRef.current.remove();
        }

        // Add a special marker for the user
        userMarkerRef.current = L.circleMarker(coords, {
          radius: 8,
          fillColor: '#5A9BD4',
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(leafletMap.current!)
          .bindPopup('Tu ubicación actual')
          .openPopup();
          
        setIsLocating(false);
      },
      (err) => {
        console.error('Error getting location:', err);
        setIsLocating(false);
        alert('No se pudo obtener tu ubicación. Asegúrate de dar permisos de GPS.');
      }
    );
  };

  const calculateRoute = (destCoords: [number, number]) => {
    if (!userCoords || !leafletMap.current) {
      if (!userCoords) alert('Primero activa "Mi ubicación" para calcular la ruta.');
      return;
    }

    // Remove existing route if any
    if (routingControl.current) {
      leafletMap.current.removeControl(routingControl.current);
    }

    // @ts-ignore - Leaflet Routing Machine types are sometimes tricky
    routingControl.current = L.Routing.control({
      waypoints: [
        L.latLng(userCoords[0], userCoords[1]),
        L.latLng(destCoords[0], destCoords[1])
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      // @ts-ignore
      lineOptions: {
        styles: [{ color: '#1C365C', weight: 4 }]
      }
    }).addTo(leafletMap.current);
  };

  // Handle routingTarget from store (DoctorCard click)
  useEffect(() => {
    if (routingTarget && userCoords && leafletMap.current) {
      const targetDoc = doctors.find(d => d.id === routingTarget);
      if (targetDoc) {
        calculateRoute([targetDoc.location.lat, targetDoc.location.lng]);
        // Clear target after starting route
        setRoutingTarget(null);
      }
    } else if (routingTarget && !userCoords) {
      alert('Activa tu ubicación primero para mostrar la ruta.');
      setRoutingTarget(null);
    }
  }, [routingTarget, userCoords, doctors]);

  // Handle location search zoom
  useEffect(() => {
    if (!targetLocation || !leafletMap.current) return;

    const fetchCoords = async () => {
      try {
        // OSM Geocoding API. Restrict search to Nicaragua.
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(targetLocation)},Nicaragua&format=json&limit=1`);
        const data = await res.json();
        
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          leafletMap.current?.flyTo([lat, lon], 14, {
            duration: 1.5
          });
          // Ensure map knows its size after flying
          setTimeout(() => leafletMap.current?.invalidateSize(), 1600);
        }
      } catch (error) {
        console.error('Map search failed:', error);
      }
    };

    fetchCoords();
  }, [targetLocation]);

  useEffect(() => {
    if (markersLayer.current && leafletMap.current) {
      markersLayer.current.clearLayers();

      const markers: L.Marker[] = [];
      doctors.forEach((doc) => {
        const marker = L.marker([doc.location.lat, doc.location.lng])
          .bindPopup(`<b>${doc.name}</b><br>${doc.specialty}`);
        marker.addTo(markersLayer.current!);
        markers.push(marker);
      });

      if (markers.length > 0 && !userCoords && !targetLocation) {
        const group = L.featureGroup(markers);
        leafletMap.current.fitBounds(group.getBounds().pad(0.1));
      }
    }
  }, [doctors, userCoords, targetLocation]);

  return (
    <div className="w-full h-full min-h-[400px] rounded-[2.5rem] overflow-hidden shadow-[0_10px_30px_rgba(28,54,92,0.05)] border border-[#1C365C]/5 bg-white relative">
      <div ref={mapRef} className="w-full h-full min-h-[400px] z-0" />
      
      {/* Map Controls Overlay */}
      <div className="absolute top-6 right-6 z-[1000] flex flex-col gap-2">
        <Button 
          variant="outline" 
          onClick={findMe}
          className="bg-white/90 backdrop-blur-md shadow-lg border border-[#1C365C]/10 hover:bg-white text-[#1C365C] h-12 px-5 rounded-2xl font-bold transition-all"
          disabled={isLocating}
        >
          {isLocating ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <MapPin className="h-5 w-5 text-[#5A9BD4]" />
          )}
          <span className="ml-2 hidden sm:inline">Mi ubicación</span>
        </Button>
      </div>
    </div>
  );
};

export default SearchMap;
