import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Waves, Activity, AlertTriangle, Wind, ThermometerSun } from 'lucide-react';
import { Input } from '../ui/input';

const ImpactPredictionPanel = ({ impactData, missionStatus }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [liveValues, setLiveValues] = useState({});

  // Major cities across 15 countries with coordinates
  const cities = [
    // India
    { name: 'Mumbai', country: 'India', lat: 19.07, lng: 72.87, population: 20411000, coastal: true },
    { name: 'Delhi', country: 'India', lat: 28.61, lng: 77.20, population: 16787000, coastal: false },
    { name: 'Chennai', country: 'India', lat: 13.08, lng: 80.27, population: 7088000, coastal: true },
    
    // USA
    { name: 'New York', country: 'USA', lat: 40.71, lng: -74.00, population: 8336000, coastal: true },
    { name: 'Los Angeles', country: 'USA', lat: 34.05, lng: -118.24, population: 3979000, coastal: true },
    { name: 'Chicago', country: 'USA', lat: 41.87, lng: -87.62, population: 2716000, coastal: false },
    
    // China
    { name: 'Shanghai', country: 'China', lat: 31.23, lng: 121.47, population: 24256800, coastal: true },
    { name: 'Beijing', country: 'China', lat: 39.90, lng: 116.40, population: 21516000, coastal: false },
    
    // Japan
    { name: 'Tokyo', country: 'Japan', lat: 35.68, lng: 139.69, population: 13960000, coastal: true },
    { name: 'Osaka', country: 'Japan', lat: 34.69, lng: 135.50, population: 2725000, coastal: true },
    
    // UK
    { name: 'London', country: 'UK', lat: 51.50, lng: -0.12, population: 8982000, coastal: false },
    { name: 'Manchester', country: 'UK', lat: 53.48, lng: -2.24, population: 547627, coastal: false },
    
    // Brazil
    { name: 'São Paulo', country: 'Brazil', lat: -23.55, lng: -46.63, population: 12325000, coastal: false },
    { name: 'Rio de Janeiro', country: 'Brazil', lat: -22.90, lng: -43.17, population: 6748000, coastal: true },
    
    // Australia
    { name: 'Sydney', country: 'Australia', lat: -33.86, lng: 151.20, population: 5312000, coastal: true },
    { name: 'Melbourne', country: 'Australia', lat: -37.81, lng: 144.96, population: 5078000, coastal: true },
    
    // France
    { name: 'Paris', country: 'France', lat: 48.85, lng: 2.35, population: 2161000, coastal: false },
    { name: 'Marseille', country: 'France', lat: 43.29, lng: 5.36, population: 869815, coastal: true },
    
    // Germany
    { name: 'Berlin', country: 'Germany', lat: 52.52, lng: 13.40, population: 3645000, coastal: false },
    { name: 'Hamburg', country: 'Germany', lat: 53.55, lng: 9.99, population: 1841000, coastal: true },
    
    // Canada
    { name: 'Toronto', country: 'Canada', lat: 43.65, lng: -79.38, population: 2930000, coastal: false },
    { name: 'Vancouver', country: 'Canada', lat: 49.28, lng: -123.12, population: 631486, coastal: true },
    
    // Mexico
    { name: 'Mexico City', country: 'Mexico', lat: 19.43, lng: -99.13, population: 8918000, coastal: false },
    { name: 'Cancún', country: 'Mexico', lat: 21.16, lng: -86.85, population: 628306, coastal: true },
    
    // South Korea
    { name: 'Seoul', country: 'South Korea', lat: 37.56, lng: 126.97, population: 9776000, coastal: false },
    { name: 'Busan', country: 'South Korea', lat: 35.17, lng: 129.07, population: 3449000, coastal: true },
    
    // Italy
    { name: 'Rome', country: 'Italy', lat: 41.90, lng: 12.49, population: 2873000, coastal: false },
    { name: 'Naples', country: 'Italy', lat: 40.85, lng: 14.26, population: 967069, coastal: true },
    
    // Spain
    { name: 'Madrid', country: 'Spain', lat: 40.41, lng: -3.70, population: 3223000, coastal: false },
    { name: 'Barcelona', country: 'Spain', lat: 41.38, lng: 2.17, population: 1620000, coastal: true },
    
    // Russia
    { name: 'Moscow', country: 'Russia', lat: 55.75, lng: 37.61, population: 12506000, coastal: false },
    { name: 'Saint Petersburg', country: 'Russia', lat: 59.93, lng: 30.36, population: 5384000, coastal: true },
  ];

  // Calculate distance from impact point (using simple approximation)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Calculate impact effects for each city
  const calculateCityImpact = (city) => {
    if (!impactData) return null;

    const impactLat = 20; // Default impact latitude
    const impactLng = -40; // Default impact longitude
    const distance = calculateDistance(city.lat, city.lng, impactLat, impactLng);
    
    const baseEnergy = impactData.impactEnergy || 100;
    const baseSeismic = impactData.seismicMagnitude || 7.5;
    
    // Distance factor (closer = more impact)
    const distanceFactor = Math.max(0, 1 - (distance / 10000));
    
    // Add real-time variation (±5%)
    const variation = liveValues[city.name] || 0;
    
    // Calculate effects
    const seismicMagnitude = Math.max(0, (baseSeismic * distanceFactor * (1 + variation * 0.05))).toFixed(2);
    const tsunamiHeight = city.coastal ? Math.max(0, (15 * distanceFactor * (1 + variation * 0.05))).toFixed(1) : 0;
    const windSpeed = Math.max(0, (200 * distanceFactor * (1 + variation * 0.05))).toFixed(0);
    const tempIncrease = Math.max(0, (50 * distanceFactor * (1 + variation * 0.05))).toFixed(1);
    const affectedPop = Math.floor(city.population * distanceFactor * (1 + variation * 0.05));
    
    return {
      seismicMagnitude: parseFloat(seismicMagnitude),
      tsunamiHeight: parseFloat(tsunamiHeight),
      windSpeed: parseInt(windSpeed),
      tempIncrease: parseFloat(tempIncrease),
      affectedPop,
      distance: distance.toFixed(0),
      riskLevel: distanceFactor > 0.7 ? 'critical' : distanceFactor > 0.4 ? 'high' : distanceFactor > 0.2 ? 'moderate' : 'low'
    };
  };

  // Update values continuously in real-time
  useEffect(() => {
    if (missionStatus !== 'impact') return;

    const interval = setInterval(() => {
      const newValues = {};
      cities.forEach(city => {
        newValues[city.name] = (Math.random() - 0.5) * 2; // Random variation -1 to 1
      });
      setLiveValues(newValues);
    }, 500); // Update every 500ms for smooth real-time effect

    return () => clearInterval(interval);
  }, [missionStatus]);

  // Filter cities based on search
  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (missionStatus === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 border-2 border-green-500 bg-green-500/10"
      >
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-bold text-green-500">No Impact Threat</h3>
        </div>
        <p className="text-sm text-green-600">All cities safe - deflection successful!</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-6 space-y-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
        <h3 className="text-lg font-bold">Global Impact Predictions</h3>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search city or country..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-background/50 border-border/50"
        />
      </div>

      {/* Cities List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {filteredCities.map((city, index) => {
            const impact = calculateCityImpact(city);
            if (!impact) return null;

            return (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.02 }}
                className={`p-3 rounded-lg border ${
                  impact.riskLevel === 'critical' ? 'bg-red-500/10 border-red-500/50' :
                  impact.riskLevel === 'high' ? 'bg-orange-500/10 border-orange-500/50' :
                  impact.riskLevel === 'moderate' ? 'bg-yellow-500/10 border-yellow-500/50' :
                  'bg-blue-500/10 border-blue-500/50'
                }`}
              >
                {/* City Header */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <h4 className="font-bold text-sm">{city.name}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">{city.country} • {impact.distance} km from impact</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                    impact.riskLevel === 'critical' ? 'bg-red-500 text-white' :
                    impact.riskLevel === 'high' ? 'bg-orange-500 text-white' :
                    impact.riskLevel === 'moderate' ? 'bg-yellow-500 text-black' :
                    'bg-blue-500 text-white'
                  }`}>
                    {impact.riskLevel.toUpperCase()}
                  </span>
                </div>

                {/* Impact Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-red-500" />
                    <span className="text-muted-foreground">Seismic:</span>
                    <span className="font-mono font-bold text-red-500">{impact.seismicMagnitude}</span>
                  </div>

                  {city.coastal && (
                    <div className="flex items-center gap-1">
                      <Waves className="w-3 h-3 text-blue-500" />
                      <span className="text-muted-foreground">Tsunami:</span>
                      <span className="font-mono font-bold text-blue-500">{impact.tsunamiHeight}m</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <Wind className="w-3 h-3 text-cyan-500" />
                    <span className="text-muted-foreground">Wind:</span>
                    <span className="font-mono font-bold text-cyan-500">{impact.windSpeed} km/h</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <ThermometerSun className="w-3 h-3 text-orange-500" />
                    <span className="text-muted-foreground">Temp:</span>
                    <span className="font-mono font-bold text-orange-500">+{impact.tempIncrease}°C</span>
                  </div>
                </div>

                {/* Affected Population */}
                {impact.affectedPop > 0 && (
                  <div className="mt-2 pt-2 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">
                      Affected: <span className="font-bold text-red-500">{(impact.affectedPop / 1000000).toFixed(2)}M people</span>
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredCities.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No cities found</p>
        </div>
      )}
    </motion.div>
  );
};

export default ImpactPredictionPanel;
