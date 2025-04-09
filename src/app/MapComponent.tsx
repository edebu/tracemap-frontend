'use client';
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import MapLayerSelector from './MapLayerSelector';
import { Location } from "./types";

interface MapComponentProps {
  locations: Location[];
}

// Create a custom marker icon with hop number
const createMarkerIcon = (hopNumber: number) => {
  return new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #2563eb; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; justify-content: center; align-items: center; font-weight: bold; box-shadow: 0 0 3px rgba(0,0,0,0.3);">${hopNumber}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

// Component to handle map bounds fitting
function FitBounds({ points }: { points: L.LatLngTuple[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { 
        padding: [50, 50],
        maxZoom: 13,
        animate: true
      });
    }
  }, [map, points]);

  return null;
}

// Define available dark map tile layers
const darkTileLayers = [
  {
    name: "Stadia Dark",
    url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
  },
  {
    name: "CartoDB Dark",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }
];

export default function MapComponent({ locations }: MapComponentProps) {
  const [selectedTileLayerIndex, setSelectedTileLayerIndex] = useState(0);
  const [mapReady, setMapReady] = useState(true);

  // Ensure we have valid locations for bounds
  const hasLocations = locations && locations.length > 0;
  
  // Default world view
  const defaultCenter: L.LatLngTuple = [20, 0];
  const defaultZoom = 2;
  
  const polylinePoints = hasLocations 
    ? locations.map(loc => [loc.lat, loc.lon] as L.LatLngTuple)
    : [];

  // Use effect to ensure map is initialized properly
  useEffect(() => {
    // Set mapReady to true after component mounts to ensure the DOM is ready
    setMapReady(true);
    
    // Fix for Leaflet marker icons in Next.js - MOVED INSIDE COMPONENT
    if (typeof window !== 'undefined') {
      // When the component mounts, fix the Leaflet icon paths
      // delete (L.Icon.Default.prototype as any)._getIconUrl;
      
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        iconUrl: '/leaflet/marker-icon.png',
        shadowUrl: '/leaflet/marker-shadow.png'
      });
    }
  }, []);
  
  // Custom popup styles
  useEffect(() => {
    // Add custom CSS to override the default Leaflet popup styles
    if (typeof window !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = `
        .leaflet-popup-content-wrapper {
          background: #27272a;
          color: #f4f4f5;
          border-radius: 4px;
          border: 1px solid #3f3f46;
        }
        .leaflet-popup-tip {
          background: #27272a;
          border: 1px solid #3f3f46;
        }
        .leaflet-popup-content {
          margin: 10px;
        }
        .leaflet-container a {
          color: #3b82f6;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);
  
  if (!mapReady && typeof window === 'undefined') {
    // If we're not on the client yet, return a loading placeholder
    return (
      <div className="map-container" style={{ width: "100%", height: "100%", minHeight: "500px", background: "#242424", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div>Loading map...</div>
      </div>
    );
  }
  
  return (
    <div className="map-container relative" style={{ width: "100%", height: "100%", minHeight: "500px" }}>
      <MapLayerSelector 
        options={darkTileLayers}
        selectedIndex={selectedTileLayerIndex}
        onChange={setSelectedTileLayerIndex}
      />
      
      <MapContainer 
        key={`map-${mapReady}-${selectedTileLayerIndex}`} // Force re-render when these values change
        center={defaultCenter} 
        zoom={defaultZoom} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%" }}
        worldCopyJump={true} 
        attributionControl={false} // Hide default attribution
        zoomControl={false} // Hide default zoom controls
        maxBounds={[
          [90, -180],
          [-90, 180]
        ]}
        maxBoundsViscosity={1.0}
        minZoom={2}
      >
        {/* Attribution in better position */}
        <div className="leaflet-bottom leaflet-right" style={{ margin: "5px", fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>
          <span dangerouslySetInnerHTML={{ __html: darkTileLayers[selectedTileLayerIndex].attribution }} />
        </div>
        
        {/* Custom zoom control position */}
        <div className="leaflet-top leaflet-right" style={{ margin: "10px" }}>
          <div className="leaflet-control-zoom leaflet-bar leaflet-control"></div>
        </div>
      
        {/* Use the selected tile layer */}
        <TileLayer
          url={darkTileLayers[selectedTileLayerIndex].url}
          noWrap={false}
        />
        
        {hasLocations && (
          <>
            {locations.map((loc, idx) => (
              <Marker 
                key={idx} 
                position={[loc.lat as number, loc.lon as number]} 
                icon={createMarkerIcon(loc.hop || idx + 1)}
              >
                <Popup>
                  <div className="text-zinc-100">
                    <strong>Hop #{loc.hop || idx + 1}</strong><br />
                    <strong>IP:</strong> {loc.ip} <br />
                    <strong>City:</strong> {loc.city || "Unknown"} <br />
                    <strong>Country:</strong> {loc.country || "Unknown"}
                  </div>
                </Popup>
              </Marker>
            ))}
            <Polyline 
              positions={polylinePoints} 
              color="#3b82f6" 
              weight={3} 
              opacity={0.8}
              dashArray="5, 5"
            />
            
            {/* Only fit bounds if we have locations */}
            <FitBounds points={polylinePoints} />
          </>
        )}
      </MapContainer>
    </div>
  );
}