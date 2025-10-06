import { create } from 'zustand';

const useAsteroidStore = create((set) => ({
  // Selected asteroid data
  selectedAsteroid: null,
  
  // Simulation parameters
  diameter: 1.0, // km
  mass: 1.5e12, // kg
  velocity: 20, // km/s
  angle: 45, // degrees
  
  // Deflection strategy
  deflectionMethod: 'kinetic',
  deltaV: 0, // km/s
  
  // Impact results
  impactEnergy: 0,
  craterSize: 0,
  seismicMagnitude: 0,
  tsunamiWarning: false,
  impactLocation: { lat: 0, lng: 0 },
  
  // Actions
  setSelectedAsteroid: (asteroid) => set({ selectedAsteroid: asteroid }),
  
  updateParameter: (key, value) => set({ [key]: value }),
  
  setDeflection: (method, deltaV) => set({ 
    deflectionMethod: method, 
    deltaV: deltaV 
  }),
  
  calculateImpact: () => set((state) => {
    // Impact energy calculation: E = 0.5 * m * v^2
    const velocityMs = state.velocity * 1000; // convert to m/s
    const energy = 0.5 * state.mass * velocityMs * velocityMs;
    const tntEquivalent = energy / 4.184e9; // Convert to megatons TNT
    
    // Crater size estimation (simplified)
    const craterSize = Math.pow(tntEquivalent, 0.25) * 0.1;
    
    // Seismic magnitude estimation
    const seismicMagnitude = 0.67 * Math.log10(tntEquivalent) + 3.87;
    
    return {
      impactEnergy: energy,
      craterSize: craterSize,
      seismicMagnitude: seismicMagnitude,
      tsunamiWarning: state.impactLocation.lng !== 0, // simplified ocean check
    };
  }),
  
  resetSimulation: () => set({
    diameter: 1.0,
    mass: 1.5e12,
    velocity: 20,
    angle: 45,
    deflectionMethod: 'kinetic',
    deltaV: 0,
  }),
}));

export default useAsteroidStore;
