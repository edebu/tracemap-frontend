"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import MapView from "./MapView";
import { Location } from "./types";


interface Hop {
  hop: number;
  ip: string;
  host?: string;
  time?: number;
}
 

export default function Home() {
  const [target, setTarget] = useState<string>("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Add custom scrollbar styling
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = `
        /* Custom scrollbar styles */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(39, 39, 42, 0.4);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(87, 87, 99, 0.5);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(113, 113, 122, 0.6);
        }
        
        /* Loading spinner animation */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .spinner {
          animation: spin 1.5s linear infinite;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  const handleTrace = async () => {
    if (!target) {
      setError("Please enter a target domain or IP");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const traceRes = await axios.get<Hop[]>(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/traceroute?target=${target}`);
      const hops = traceRes.data;

      const enriched: Location[] = await Promise.all(
        hops.map(async (hop: Hop, index: number) => {
          try {
            const geo = await axios.get(`${process.env.NEXT_PUBLIC_IP_API_URL}/json/${hop.ip}`);
            return {
              ...hop,
              // hop: index + 1, // Add hop number based on index
              lat: geo.data.lat,
              lon: geo.data.lon,
              city: geo.data.city,
              country: geo.data.country,
            };
          } catch (error) {
            console.error(`Failed to get geolocation for IP ${hop.ip}:`, error);
            return { ...hop, hop: index + 1 }; // Return the hop without geolocation data but with hop number
          }
        })
      );

      setLocations(enriched.filter((loc: Location) => loc.lat && loc.lon));
    } catch (error) {
      console.error("Trace request failed:", error);
      setError("Failed to perform traceroute. Please check the target and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-row h-screen bg-zinc-900 text-zinc-100 overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 max-w-md bg-zinc-800 p-6 flex flex-col overflow-hidden border-r border-zinc-700">
        {/* Logo and Title */}
        <div className="flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <polyline points="4,7 8,12 4,17" />
            <polyline points="20,7 16,12 20,17" />
          </svg>
          <h1 className="text-2xl font-bold text-zinc-100">TraceMap</h1>
        </div>
        
        <input
          className="bg-zinc-700 text-zinc-100 p-3 rounded mb-4 border border-zinc-600 focus:outline-none focus:border-blue-500"
          placeholder="E.g. google.com"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleTrace();
            }
          }}
        />
        <button
          onClick={handleTrace}
          className={`${
            isLoading ? "bg-blue-600 opacity-75" : "bg-blue-600 hover:bg-blue-700"
          } text-zinc-100 px-4 py-2 rounded mb-4 transition-colors duration-200`}
          disabled={isLoading}
        >
          {isLoading ? "Tracing..." : "Trace"}
        </button>
        {error && (
          <div className="bg-red-900/70 text-zinc-100 p-3 rounded mb-4 border border-red-800">
            {error}
          </div>
        )}
        <div className="flex-1 overflow-hidden">
          <h2 className="text-lg font-semibold mb-3 text-zinc-200">Hops List</h2>
          <div className="custom-scrollbar pr-1 overflow-y-auto" style={{ maxHeight: "calc(100% - 30px)" }}>
            {isLoading ? (
              <p className="text-zinc-400">Loading hops data...</p>
            ) : locations.length > 0 ? (
              <ol className="space-y-2">
                {locations.map((loc, index) => (
                  <li key={index} className="p-2.5 bg-zinc-700/70 rounded border border-zinc-600">
                    <p className="font-medium">
                      <span className="inline-flex items-center justify-center bg-blue-600 text-zinc-100 rounded-full w-5 h-5 mr-2 text-xs">
                        {loc.hop || index + 1}
                      </span>
                      {loc.ip}
                    </p>
                    <p className="text-zinc-300 text-sm mt-1">
                      <strong className="text-zinc-400">City:</strong> {loc.city || "Unknown"}
                    </p>
                    <p className="text-zinc-300 text-sm">
                      <strong className="text-zinc-400">Country:</strong> {loc.country || "Unknown"}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-zinc-400">No hop data available yet. Run a trace to see results.</p>
            )}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div className="absolute inset-0">
          <MapView locations={locations} />
          
          {/* Blurred overlay with spinner when loading */}
          {isLoading && (
            <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-xs z-[9999] flex items-center justify-center">
              <div className="flex flex-col items-center">
                <svg className="spinner w-12 h-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-3 text-zinc-100 font-medium">Tracing route...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
