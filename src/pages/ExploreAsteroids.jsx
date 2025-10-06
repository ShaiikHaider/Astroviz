import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, AlertTriangle, CheckCircle, ExternalLink, Target, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useAsteroidStore from '../store/asteroidStore';
import { browseAsteroids, getFallbackAsteroids, extractAsteroidData } from '../utils/nasaApi';

// Import asteroid images
import asteroid1 from '../assets/asteroids/asteroid-1.jpg';
import asteroid2 from '../assets/asteroids/asteroid-2.jpg';
import asteroid3 from '../assets/asteroids/asteroid-3.jpg';
import asteroid4 from '../assets/asteroids/asteroid-4.jpg';
import asteroid5 from '../assets/asteroids/asteroid-5.jpg';
import asteroid6 from '../assets/asteroids/asteroid-6.jpg';
import asteroid7 from '../assets/asteroids/asteroid-7.jpg';
import asteroid8 from '../assets/asteroids/asteroid-8.jpg';
import asteroid9 from '../assets/asteroids/asteroid-9.jpg';
import asteroid10 from '../assets/asteroids/asteroid-10.jpg';
import asteroid11 from '../assets/asteroids/asteroid-11.jpg';
import asteroid12 from '../assets/asteroids/asteroid-12.jpg';
import asteroid13 from '../assets/asteroids/asteroid-13.jpg';
import asteroid14 from '../assets/asteroids/asteroid-14.jpg';
import asteroid15 from '../assets/asteroids/asteroid-15.jpg';
import asteroid16 from '../assets/asteroids/asteroid-16.jpg';
import asteroid17 from '../assets/asteroids/asteroid-17.jpg';
import asteroid18 from '../assets/asteroids/asteroid-18.jpg';
import asteroid19 from '../assets/asteroids/asteroid-19.jpg';
import asteroid20 from '../assets/asteroids/asteroid-20.jpg';
import asteroid21 from '../assets/asteroids/asteroid-21.jpg';
import asteroid22 from '../assets/asteroids/asteroid-22.jpg';
import asteroid23 from '../assets/asteroids/asteroid-23.jpg';
import asteroid24 from '../assets/asteroids/asteroid-24.jpg';

const asteroidImages = [
  asteroid1, asteroid2, asteroid3, asteroid4, asteroid5, asteroid6,
  asteroid7, asteroid8, asteroid9, asteroid10, asteroid11, asteroid12,
  asteroid13, asteroid14, asteroid15, asteroid16, asteroid17, asteroid18,
  asteroid19, asteroid20, asteroid21, asteroid22, asteroid23, asteroid24
];

const ExploreAsteroids = () => {
  const navigate = useNavigate();
  // Avoid using the zustand hook here to prevent invalid hook calls
  const setSelectedAsteroidSafe = (asteroid) => {
    try {
      useAsteroidStore.getState().setSelectedAsteroid(asteroid);
    } catch (err) {
      console.error('Asteroid store setSelectedAsteroid failed', err);
    }
  };
  
  const [asteroids, setAsteroids] = useState([]);
  const [filteredAsteroids, setFilteredAsteroids] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [hazardFilter, setHazardFilter] = useState('all');
  const [selectedAsteroid, setLocalSelectedAsteroid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAsteroids();
  }, []);

  useEffect(() => {
    filterAsteroids();
  }, [searchTerm, sizeFilter, hazardFilter, asteroids]);

  const loadAsteroids = async () => {
    try {
      setLoading(true);
      const data = await browseAsteroids(0);
      const fallback = getFallbackAsteroids();
      setAsteroids([...fallback, ...(data || [])].slice(0, 50));
    } catch (error) {
      setAsteroids(getFallbackAsteroids());
    } finally {
      setLoading(false);
    }
  };

  const filterAsteroids = () => {
    let filtered = [...asteroids];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(ast =>
        ast.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Size filter
    if (sizeFilter !== 'all') {
      filtered = filtered.filter(ast => {
        const diameter = ast.estimated_diameter?.kilometers?.estimated_diameter_max || 0;
        if (sizeFilter === 'small') return diameter < 1;
        if (sizeFilter === 'medium') return diameter >= 1 && diameter < 5;
        if (sizeFilter === 'large') return diameter >= 5;
        return true;
      });
    }

    // Hazard filter
    if (hazardFilter !== 'all') {
      filtered = filtered.filter(ast =>
        hazardFilter === 'hazardous'
          ? ast.is_potentially_hazardous_asteroid
          : !ast.is_potentially_hazardous_asteroid
      );
    }

    setFilteredAsteroids(filtered);
  };

  const handleSimulate = (asteroid) => {
    const extracted = extractAsteroidData(asteroid);
    setSelectedAsteroidSafe(extracted);
    navigate('/simulator');
  };

  const AsteroidCard = ({ asteroid, index }) => {
    const diameter = asteroid.estimated_diameter?.kilometers?.estimated_diameter_max?.toFixed(2) || 'Unknown';
    const velocity = asteroid.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second || 'N/A';
    const isHazardous = asteroid.is_potentially_hazardous_asteroid;
    const asteroidImage = asteroidImages[index % asteroidImages.length];

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -8 }}
        onClick={() => setLocalSelectedAsteroid(asteroid)}
        className="bg-card border border-border rounded-xl p-6 cursor-pointer hover:border-primary transition-all group"
      >
        {/* Asteroid Visual */}
        <div className="w-full h-40 bg-gradient-to-br from-muted to-background rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
          <img 
            src={asteroidImage} 
            alt={asteroid.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
          />
          {isHazardous && (
            <div className="absolute top-2 right-2 bg-destructive text-white px-2 py-1 rounded-full text-xs font-bold">
              HAZARDOUS
            </div>
          )}
        </div>

        {/* Info */}
        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {asteroid.name}
        </h3>
        
        <div className="space-y-1 text-sm text-muted-foreground mb-4">
          <p>📏 Diameter: <span className="text-foreground font-mono">{diameter} km</span></p>
          <p>🚀 Velocity: <span className="text-foreground font-mono">{velocity} km/s</span></p>
          <div className="flex items-center gap-1">
            {isHazardous ? (
              <>
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="text-destructive font-semibold">Potentially Hazardous</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-green-500">Safe</span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSimulate(asteroid);
          }}
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <Target className="w-4 h-4" />
          Simulate Impact
        </button>
      </motion.div>
    );
  };

  const AsteroidModal = ({ asteroid, onClose }) => {
    if (!asteroid) return null;

    const extracted = extractAsteroidData(asteroid);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card border-2 border-primary rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
        >
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {asteroid.name}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 3D Preview Placeholder */}
          <div className="w-full h-64 bg-gradient-to-br from-muted to-background rounded-xl mb-6 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 animate-float" />
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-background rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Diameter</p>
                <p className="text-xl font-bold">{extracted.diameter.toFixed(2)} km</p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Velocity</p>
                <p className="text-xl font-bold">{extracted.velocity.toFixed(1)} km/s</p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Estimated Mass</p>
                <p className="text-xl font-bold">{(extracted.mass / 1e12).toFixed(2)} trillion kg</p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <div className="flex items-center gap-2">
                  {extracted.hazardous ? (
                    <>
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                      <span className="font-bold text-destructive">Hazardous</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-bold text-green-500">Safe</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {extracted.closeApproachDate && (
              <div className="p-4 bg-background rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Next Close Approach</p>
                <p className="font-bold">{extracted.closeApproachDate}</p>
                <p className="text-sm text-muted-foreground">
                  Miss Distance: {parseFloat(extracted.missDistance).toLocaleString()} km
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => handleSimulate(asteroid)}
                className="flex-1 py-3 px-6 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                <Target className="w-5 h-5" />
                Simulate Impact
              </button>
              {extracted.nasaUrl && (
                <a
                  href={extracted.nasaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-6 bg-muted text-foreground rounded-lg font-bold hover:bg-muted/80 transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  NASA JPL
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Explore Asteroids
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse detailed profiles of near-Earth asteroids using real NASA data
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 flex flex-col md:flex-row gap-4"
          >
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search asteroids by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            {/* Size Filter */}
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
            >
              <option value="all">All Sizes</option>
              <option value="small">Small (&lt;1 km)</option>
              <option value="medium">Medium (1-5 km)</option>
              <option value="large">Large (&gt;5 km)</option>
            </select>

            {/* Hazard Filter */}
            <select
              value={hazardFilter}
              onChange={(e) => setHazardFilter(e.target.value)}
              className="px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
            >
              <option value="all">All Asteroids</option>
              <option value="hazardous">Potentially Hazardous</option>
              <option value="safe">Safe</option>
            </select>
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 text-muted-foreground"
          >
            Showing {filteredAsteroids.length} asteroids
          </motion.div>

          {/* Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-muted-foreground">Loading asteroids...</p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {filteredAsteroids.map((asteroid, index) => (
                  <AsteroidCard key={asteroid.id} asteroid={asteroid} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {filteredAsteroids.length === 0 && !loading && (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No asteroids found matching your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedAsteroid && (
          <AsteroidModal
            asteroid={selectedAsteroid}
            onClose={() => setLocalSelectedAsteroid(null)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
};

export default ExploreAsteroids;
