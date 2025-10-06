// Impact physics calculations

// Calculate impact energy
export const calculateImpactEnergy = (mass, velocity) => {
  // E = 0.5 * m * v^2
  const velocityMs = velocity * 1000; // convert km/s to m/s
  const energy = 0.5 * mass * velocityMs * velocityMs;
  return energy;
};

// Convert energy to TNT equivalent
export const energyToTNT = (energy) => {
  // 1 ton of TNT = 4.184 × 10^9 joules
  const megatons = energy / (4.184e9 * 1e6);
  return megatons;
};

// Estimate crater diameter
export const calculateCraterSize = (energy, angle = 45) => {
  // Simplified crater scaling law
  const tnt = energyToTNT(energy);
  const angleEfficiency = Math.sin(angle * Math.PI / 180);
  const craterDiameter = Math.pow(tnt, 0.25) * 0.1 * angleEfficiency;
  return craterDiameter; // km
};

// Estimate seismic magnitude
export const calculateSeismicMagnitude = (energy) => {
  const tnt = energyToTNT(energy);
  // Empirical relationship between yield and magnitude
  const magnitude = 0.67 * Math.log10(tnt) + 3.87;
  return Math.min(magnitude, 10); // Cap at 10
};

// Calculate tsunami potential
export const calculateTsunamiRisk = (impactLocation, energy) => {
  // Check if impact is in ocean (simplified)
  const isOcean = impactLocation.isOcean || false;
  
  if (!isOcean) return { risk: 'none', waveHeight: 0 };
  
  const tnt = energyToTNT(energy);
  const waveHeight = Math.pow(tnt, 0.2) * 2; // Simplified wave height estimation
  
  let risk = 'low';
  if (waveHeight > 10) risk = 'high';
  else if (waveHeight > 5) risk = 'medium';
  
  return { risk, waveHeight };
};

// Calculate affected area
export const calculateAffectedArea = (craterSize, seismicMagnitude) => {
  // Primary damage zone (crater + immediate ejecta)
  const primaryRadius = craterSize * 2;
  
  // Secondary damage zone (seismic + thermal)
  const secondaryRadius = primaryRadius + (seismicMagnitude * 5);
  
  // Tertiary effects zone (atmospheric)
  const tertiaryRadius = secondaryRadius + (seismicMagnitude * 10);
  
  return {
    primary: Math.PI * primaryRadius * primaryRadius,
    secondary: Math.PI * secondaryRadius * secondaryRadius,
    tertiary: Math.PI * tertiaryRadius * tertiaryRadius
  };
};

// Estimate casualties (simplified)
export const estimateCasualties = (affectedArea, impactLocation) => {
  // Average population density (people per km²) - simplified
  const avgDensity = impactLocation.populationDensity || 50;
  
  const casualties = {
    immediate: Math.floor(affectedArea.primary * avgDensity * 0.9),
    secondary: Math.floor(affectedArea.secondary * avgDensity * 0.3),
    affected: Math.floor(affectedArea.tertiary * avgDensity * 0.1)
  };
  
  return casualties;
};

// Calculate deflection requirements
export const calculateDeflectionDeltaV = (asteroid, leadTime) => {
  // Simplified delta-v calculation
  const { mass, velocity } = asteroid;
  
  // Required velocity change decreases with lead time
  const timeYears = leadTime / 365;
  const baseDeltaV = 0.1; // km/s
  const requiredDeltaV = baseDeltaV / Math.sqrt(timeYears);
  
  return {
    requiredDeltaV,
    energy: 0.5 * mass * Math.pow(requiredDeltaV * 1000, 2),
    feasibility: requiredDeltaV < 1 ? 'high' : requiredDeltaV < 5 ? 'medium' : 'low'
  };
};

// Deflection methods analysis
export const analyzeDeflectionMethods = (asteroid, leadTimeDays) => {
  const methods = {
    kinetic: {
      name: 'Kinetic Impactor',
      description: 'Direct collision to change velocity',
      deltaVEfficiency: 0.7,
      minLeadTime: 180,
      techReadiness: 'high'
    },
    ion: {
      name: 'Ion Beam Thruster',
      description: 'Slow continuous push',
      deltaVEfficiency: 0.9,
      minLeadTime: 730,
      techReadiness: 'medium'
    },
    nuclear: {
      name: 'Nuclear Blast',
      description: 'High energy deflection',
      deltaVEfficiency: 1.5,
      minLeadTime: 90,
      techReadiness: 'low'
    },
    gravity: {
      name: 'Gravity Tractor',
      description: 'Gravitational pull deflection',
      deltaVEfficiency: 0.3,
      minLeadTime: 1460,
      techReadiness: 'medium'
    }
  };
  
  Object.keys(methods).forEach(key => {
    const method = methods[key];
    method.viable = leadTimeDays >= method.minLeadTime;
    method.score = method.viable ? 
      (method.deltaVEfficiency * (method.techReadiness === 'high' ? 1.2 : method.techReadiness === 'medium' ? 1.0 : 0.8)) : 0;
  });
  
  return methods;
};
