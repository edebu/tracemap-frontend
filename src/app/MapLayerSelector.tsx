import React from 'react';

// Define the tile layer type
interface TileLayerOption {
  name: string;
  url: string;
  attribution: string;
}

interface MapLayerSelectorProps {
  options: TileLayerOption[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

// A custom layer selector that doesn't rely on Leaflet's layer control
export default function MapLayerSelector({ options, selectedIndex, onChange }: MapLayerSelectorProps) {
  return (
    <div className="absolute top-2 right-2 z-[1000] bg-zinc-800 p-2 rounded-md shadow-md border border-zinc-700">
      <select 
        className="bg-zinc-700 text-white p-1 rounded border border-zinc-600 text-sm"
        value={selectedIndex}
        onChange={(e) => onChange(parseInt(e.target.value))}
      >
        {options.map((option, index) => (
          <option key={index} value={index}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}