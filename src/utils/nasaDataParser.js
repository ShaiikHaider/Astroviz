import nasa1 from '../data/nasa1.json';
import nasa2 from '../data/nasa2.json';

/**
 * Parse and extract asteroid data from NASA JSON files
 */
export const parseNASAAsteroids = () => {
  const asteroids = [];
  
  // Parse nasa1.json (feed data)
  if (nasa1.near_earth_objects) {
    Object.values(nasa1.near_earth_objects).forEach(dateArray => {
      dateArray.forEach(asteroid => {
        asteroids.push(formatAsteroidData(asteroid));
      });
    });
  }
  
  // Parse nasa2.json (detailed data)
  if (nasa2.id) {
    asteroids.push(formatAsteroidData(nasa2));
  }
  
  return asteroids.slice(0, 30); // Return first 30
};

/**
 * Format asteroid data for simulation
 */
const formatAsteroidData = (asteroid) => {
  const diameter = asteroid.estimated_diameter?.kilometers?.estimated_diameter_max || 1.0;
  const closeApproach = asteroid.close_approach_data?.[0];
  
  return {
    id: asteroid.id,
    name: asteroid.name || asteroid.designation || `Asteroid ${asteroid.id}`,
    diameter: diameter,
    // Estimate mass from diameter (assuming density ~2000 kg/m³)
    mass: (4/3) * Math.PI * Math.pow((diameter * 500), 3) * 2000,
    velocity: closeApproach?.relative_velocity?.kilometers_per_second 
      ? parseFloat(closeApproach.relative_velocity.kilometers_per_second)
      : 20,
    absoluteMagnitude: asteroid.absolute_magnitude_h || 20,
    isPotentiallyHazardous: asteroid.is_potentially_hazardous_asteroid || false,
    missDistance: closeApproach?.miss_distance?.kilometers 
      ? parseFloat(closeApproach.miss_distance.kilometers)
      : 500000,
    // Orbital elements (simplified)
    semiMajorAxis: 1.5, // AU
    eccentricity: 0.2,
    inclination: 15, // degrees
  };
};

/**
 * Get preloaded asteroids
 */
export const getPreloadedAsteroids = () => {
  return parseNASAAsteroids();
};

/**
 * Calculate orbital period (Kepler's 3rd law)
 */
export const calculateOrbitalPeriod = (semiMajorAxis) => {
  // T² = a³ (in years and AU)
  return Math.sqrt(Math.pow(semiMajorAxis, 3));
};

/**
 * Calculate position in orbit
 */
export const calculateOrbitalPosition = (time, semiMajorAxis, eccentricity, phase = 0) => {
  const angle = (time * 0.5 + phase) % (2 * Math.PI);
  const r = semiMajorAxis * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(angle));
  
  return {
    x: r * Math.cos(angle) * 3,
    y: 0,
    z: r * Math.sin(angle) * 3,
    angle
  };
};
