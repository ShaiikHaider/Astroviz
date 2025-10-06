const NASA_API_KEY = 'muIUYKFxM3fwQagpMI3B8mEEnSFeUdoyIn1Xeprn';
const NEO_API_URL = 'https://api.nasa.gov/neo/rest/v1';

// Fetch near-Earth asteroids
export const fetchNearEarthAsteroids = async (startDate, endDate) => {
  try {
    const response = await fetch(
      `${NEO_API_URL}/feed?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_API_KEY}`
    );
    const data = await response.json();
    return data.near_earth_objects;
  } catch (error) {
    console.error('Error fetching NEO data:', error);
    return getFallbackAsteroids();
  }
};

// Fetch asteroid by ID
export const fetchAsteroidById = async (asteroidId) => {
  try {
    const response = await fetch(
      `${NEO_API_URL}/neo/${asteroidId}?api_key=${NASA_API_KEY}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching asteroid details:', error);
    return null;
  }
};

// Browse all asteroids
export const browseAsteroids = async (page = 0) => {
  try {
    const response = await fetch(
      `${NEO_API_URL}/neo/browse?page=${page}&size=50&api_key=${NASA_API_KEY}`
    );
    const data = await response.json();
    return data.near_earth_objects;
  } catch (error) {
    console.error('Error browsing asteroids:', error);
    return getFallbackAsteroids();
  }
};

// Fallback asteroid data for offline/demo mode
export const getFallbackAsteroids = () => {
  return [
    {
      id: '2099942',
      name: '99942 Apophis (2004 MN4)',
      nasa_jpl_url: 'http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=2099942',
      absolute_magnitude_h: 19.7,
      estimated_diameter: {
        kilometers: {
          estimated_diameter_min: 0.31,
          estimated_diameter_max: 0.69
        }
      },
      is_potentially_hazardous_asteroid: true,
      close_approach_data: [{
        close_approach_date: '2029-04-13',
        relative_velocity: { kilometers_per_second: '7.42' },
        miss_distance: { kilometers: '38000' }
      }]
    },
    {
      id: '101955',
      name: '101955 Bennu (1999 RQ36)',
      nasa_jpl_url: 'http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=101955',
      absolute_magnitude_h: 20.9,
      estimated_diameter: {
        kilometers: {
          estimated_diameter_min: 0.45,
          estimated_diameter_max: 0.51
        }
      },
      is_potentially_hazardous_asteroid: true,
      close_approach_data: [{
        close_approach_date: '2135-09-25',
        relative_velocity: { kilometers_per_second: '11.2' },
        miss_distance: { kilometers: '750000' }
      }]
    },
    {
      id: '65803',
      name: '65803 Didymos (1996 GT)',
      nasa_jpl_url: 'http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=65803',
      absolute_magnitude_h: 18.2,
      estimated_diameter: {
        kilometers: {
          estimated_diameter_min: 0.7,
          estimated_diameter_max: 0.85
        }
      },
      is_potentially_hazardous_asteroid: false,
      close_approach_data: [{
        close_approach_date: '2123-05-05',
        relative_velocity: { kilometers_per_second: '8.9' },
        miss_distance: { kilometers: '5900000' }
      }]
    },
    {
      id: '4179',
      name: '4179 Toutatis (1989 AC)',
      nasa_jpl_url: 'http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=4179',
      absolute_magnitude_h: 15.3,
      estimated_diameter: {
        kilometers: {
          estimated_diameter_min: 4.6,
          estimated_diameter_max: 5.4
        }
      },
      is_potentially_hazardous_asteroid: true,
      close_approach_data: [{
        close_approach_date: '2069-11-05',
        relative_velocity: { kilometers_per_second: '13.5' },
        miss_distance: { kilometers: '3000000' }
      }]
    }
  ];
};

// Extract key asteroid parameters
export const extractAsteroidData = (asteroid) => {
  const diameter = asteroid.estimated_diameter?.kilometers?.estimated_diameter_max || 1.0;
  const closeApproach = asteroid.close_approach_data?.[0];
  const velocity = parseFloat(closeApproach?.relative_velocity?.kilometers_per_second || 20);
  
  // Estimate mass based on diameter (assuming average density of 3000 kg/m³)
  const volume = (4/3) * Math.PI * Math.pow((diameter * 500), 3); // radius in meters
  const mass = volume * 3000;
  
  return {
    id: asteroid.id,
    name: asteroid.name,
    diameter: diameter,
    mass: mass,
    velocity: velocity,
    hazardous: asteroid.is_potentially_hazardous_asteroid,
    closeApproachDate: closeApproach?.close_approach_date,
    missDistance: closeApproach?.miss_distance?.kilometers,
    absoluteMagnitude: asteroid.absolute_magnitude_h,
    nasaUrl: asteroid.nasa_jpl_url
  };
};
