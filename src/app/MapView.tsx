import React from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { Location } from "./types";


interface MapViewProps {
  locations: Location[];
}

// Dynamic import for Leaflet components with SSR disabled
const MapWithNoSSR = dynamic(
  () => import('./MapComponent'), 
  { 
    ssr: false,
    loading: () => <div style={{ width: "100%", height: "100%", minHeight: "500px" }}>Loading map...</div>
  }
);

function MapView({ locations }: MapViewProps) {
  // Handle empty locations array
//   if (!locations || locations.length === 0) return null;

  // Filter out invalid location data
  const validLocations = locations.filter(
    loc => typeof loc.lat === 'number' && typeof loc.lon === 'number'
  );

//   if (validLocations.length === 0) return <div>No valid location data available</div>;

  return <MapWithNoSSR locations={validLocations} />;
}

export default MapView;
