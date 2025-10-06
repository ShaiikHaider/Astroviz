import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Shield, AlertTriangle, CheckCircle, Play, RotateCcw, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Earth3D from '../components/simulator/Earth3D';
import Asteroid3D from '../components/simulator/Asteroid3D';
import OrbitPath from '../components/simulator/OrbitPath';
import ImpactParticles from '../components/simulator/ImpactParticles';
import LiveDataPanel from '../components/simulator/LiveDataPanel';
import ImpactPredictionPanel from '../components/simulator/ImpactPredictionPanel';
import { Button } from '../components/ui/button';
import { Slider } from '../components/ui/slider';
import useAsteroidStore from '../store/asteroidStore';
import { getPreloadedAsteroids, calculateOrbitalPosition } from '../utils/nasaDataParser';
import { calculateImpactEnergy, energyToTNT, calculateCraterSize, calculateSeismicMagnitude } from '../utils/impactCalculations';
import 'leaflet/dist/leaflet.css';

// Scene Controller for animation
const SceneController = ({ 
  isPlaying, 
  asteroidData, 
  deflectionDeltaV,
  onPositionUpdate 
}) => {
  const timeRef = useRef(0);
  
  useFrame((state, delta) => {
    if (!isPlaying) return;
    
    timeRef.current += delta * 0.5;
    
    const semiMajor = asteroidData?.semiMajorAxis ?? 1.5;
    const ecc = asteroidData?.eccentricity ?? 0.2;
    const pos = calculateOrbitalPosition(
      timeRef.current,
      semiMajor,
      ecc,
      0
    );
    
    onPositionUpdate(pos, timeRef.current);
  });
  
  return null;
};

const AsteroidSimulator = () => {
  const [asteroidList] = useState(getPreloadedAsteroids());
  const initialFromStore = useAsteroidStore.getState().selectedAsteroid;
  const [selectedAsteroid, setSelectedAsteroid] = useState(initialFromStore || asteroidList[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentPosition, setCurrentPosition] = useState({ x: 6, y: 0, z: 0 });
  const [simulationTime, setSimulationTime] = useState(0);
  
  // Map center based on selected asteroid
  const computeAsteroidLocation = (a) => {
    if (!a) return [20, -40];
    const base = (parseInt(a.id || '0', 10) || 0) + Math.round((a.diameter || 1) * 100);
    const lat = Math.sin(base) * 60;
    const lng = Math.cos(base) * 180;
    return [Number(lat.toFixed(2)), Number(lng.toFixed(2))];
  };
  
  // Simulation parameters
  const [diameter, setDiameter] = useState(selectedAsteroid?.diameter || 1.0);
  const [velocity, setVelocity] = useState(selectedAsteroid?.velocity || 20);
  const [mass, setMass] = useState(selectedAsteroid?.mass || 1.5e12);
  const [angle, setAngle] = useState(45);
  
  // Deflection
  const [deflectionMethod, setDeflectionMethod] = useState('kinetic');
  const [deltaV, setDeltaV] = useState(0);
  
  // Visual size mapping: 10 km -> 1 world unit, clamped to [0.1, 2.0]
  const mapDiameterToWorldSize = (d) => {
    const size = (d || 0) / 10;
    return Math.max(0.1, Math.min(size, 2.0));
  };
  
  // Results
  const [impactData, setImpactData] = useState(null);
  const [missionStatus, setMissionStatus] = useState('monitoring');
  const [showImpact, setShowImpact] = useState(false);
  const [impactLocation, setImpactLocation] = useState(computeAsteroidLocation(selectedAsteroid));
  const [impactPosition, setImpactPosition] = useState([2, 0, 0]);

  // Sync with store asteroid from Explore page (safe, no hooks)
  useEffect(() => {
    const s = useAsteroidStore.getState().selectedAsteroid;
    if (s) {
      setSelectedAsteroid(s);
      // Update all parameters from the selected asteroid
      setDiameter(s.diameter || 1.0);
      setVelocity(s.velocity || 20);
      setMass(s.mass || 1.5e12);
      // Reset simulation state
      setCurrentPosition({ x: 6, y: 0, z: 0 });
      setSimulationTime(0);
      setShowImpact(false);
    }
  }, []);

  // Update when asteroid selected from dropdown
  useEffect(() => {
    if (selectedAsteroid) {
      setDiameter(selectedAsteroid.diameter || 1.0);
      setVelocity(selectedAsteroid.velocity || 20);
      setMass(selectedAsteroid.mass || 1.5e12);
    }
  }, [selectedAsteroid]);
  
  useEffect(() => {
    setImpactLocation(computeAsteroidLocation(selectedAsteroid));
  }, [selectedAsteroid]);
  
  // Calculate impact continuously
  useEffect(() => {
    const effectiveVelocity = Math.max(0, velocity - deltaV);
    const energy = calculateImpactEnergy(mass, effectiveVelocity);
    const tnt = energyToTNT(energy);
    const craterSize = calculateCraterSize(energy, angle);
    const seismic = calculateSeismicMagnitude(energy);
    
    const distanceFromEarth = Math.sqrt(
      currentPosition.x * currentPosition.x +
      currentPosition.y * currentPosition.y +
      currentPosition.z * currentPosition.z
    ) * 150000; // Scale to km
    
    const timeToImpact = distanceFromEarth / velocity / 86400; // days
    
    const isDeflected = deltaV >= velocity * 0.05 || distanceFromEarth > 800000;
    
    setImpactData({
      distanceFromEarth,
      currentVelocity: effectiveVelocity,
      timeToImpact,
      impactEnergy: tnt,
      craterSize,
      seismicMagnitude: seismic,
      position: {
        x: currentPosition.x * 150000,
        y: currentPosition.y * 150000,
        z: currentPosition.z * 150000
      }
    });
    
    setMissionStatus(isDeflected ? 'success' : 'impact');
    
    // Enhanced collision detection - trigger explosion when asteroid hits Earth
    const earthRadius = 2;
    const distanceToCenter = Math.sqrt(
      currentPosition.x * currentPosition.x +
      currentPosition.y * currentPosition.y +
      currentPosition.z * currentPosition.z
    );
    
    // Collision threshold - game-like precision
    const collisionThreshold = earthRadius + mapDiameterToWorldSize(diameter);
    
    if (distanceToCenter <= collisionThreshold && !isDeflected && !showImpact) {
      // Calculate precise impact point on Earth's surface
      const normalizedX = currentPosition.x / distanceToCenter;
      const normalizedY = currentPosition.y / distanceToCenter;
      const normalizedZ = currentPosition.z / distanceToCenter;
      
      const impactX = normalizedX * earthRadius;
      const impactY = normalizedY * earthRadius;
      const impactZ = normalizedZ * earthRadius;
      
      setImpactPosition([impactX, impactY, impactZ]);
      setShowImpact(true);
      
      // Keep explosion visible for 5 seconds (more dramatic)
      setTimeout(() => setShowImpact(false), 5000);
    }
  }, [currentPosition, velocity, mass, angle, deltaV, simulationTime]);

  const handlePositionUpdate = (pos, time) => {
    setCurrentPosition(pos);
    setSimulationTime(time);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentPosition({ x: 6, y: 0, z: 0 });
    setSimulationTime(0);
    setDeltaV(0);
    setShowImpact(false);
    setImpactPosition([2, 0, 0]);
    setTimeout(() => setIsPlaying(true), 100);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-16 pb-20 bg-gradient-to-b from-background via-background to-primary/5">
        <div className="max-w-[1800px] mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-primary">
              🚀 Asteroid Trajectory & Impact Simulator
            </h1>
            <p className="text-xl text-muted-foreground">
              Real-time dynamic 3D simulation with NASA data
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Panel - Controls */}
            <div className="space-y-6">
              {/* Asteroid Selection */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-primary" />
                  Select Asteroid
                </h3>
                <select
                  className="w-full p-3 rounded-lg bg-background border border-border text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  value={asteroidList.indexOf(selectedAsteroid)}
                  onChange={(e) => setSelectedAsteroid(asteroidList[e.target.value])}
                >
                  {asteroidList.map((asteroid, idx) => (
                    <option key={asteroid.id} value={idx}>
                      {asteroid.name} {asteroid.isPotentiallyHazardous ? '⚠️' : ''}
                    </option>
                  ))}
                </select>
                
                {selectedAsteroid && (
                  <div className="mt-4 p-3 bg-background/50 rounded-lg border border-border/50 text-sm space-y-1">
                    <p><span className="text-muted-foreground">Diameter:</span> <span className="font-mono text-primary">{selectedAsteroid.diameter.toFixed(2)} km</span></p>
                    <p><span className="text-muted-foreground">Velocity:</span> <span className="font-mono text-secondary">{selectedAsteroid.velocity.toFixed(2)} km/s</span></p>
                    <p><span className="text-muted-foreground">Hazardous:</span> {selectedAsteroid.isPotentiallyHazardous ? '⚠️ Yes' : '✅ No'}</p>
                  </div>
                )}
              </motion.div>

              {/* Parameters */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-bold mb-4">Simulation Parameters</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-muted-foreground">Diameter (km)</label>
                      <span className="text-sm font-mono text-primary">{diameter.toFixed(2)} km</span>
                    </div>
                    <Slider
                      value={[diameter]}
                      onValueChange={([v]) => setDiameter(v)}
                      min={0.1}
                      max={10}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-muted-foreground">Velocity (km/s)</label>
                      <span className="text-sm font-mono text-secondary">{velocity.toFixed(1)} km/s</span>
                    </div>
                    <Slider
                      value={[velocity]}
                      onValueChange={([v]) => setVelocity(v)}
                      min={5}
                      max={50}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-muted-foreground">Impact Angle (°)</label>
                      <span className="text-sm font-mono text-accent">{angle}°</span>
                    </div>
                    <Slider
                      value={[angle]}
                      onValueChange={([v]) => setAngle(v)}
                      min={15}
                      max={90}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Planetary Defense */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-secondary" />
                  Planetary Defense System
                </h3>
                <div className="space-y-4">
                  <select
                    className="w-full p-3 rounded-lg bg-background border border-border text-sm"
                    value={deflectionMethod}
                    onChange={(e) => setDeflectionMethod(e.target.value)}
                  >
                    <option value="kinetic">🚀 Kinetic Impactor</option>
                    <option value="ion">🔋 Ion Beam Thruster</option>
                    <option value="nuclear">☢️ Nuclear Blast</option>
                    <option value="gravity">🛸 Gravity Tractor</option>
                  </select>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-muted-foreground flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Deflection Delta-V (km/s)
                      </label>
                      <span className="text-sm font-mono text-yellow-500">{deltaV.toFixed(2)} km/s</span>
                    </div>
                    <Slider
                      value={[deltaV]}
                      onValueChange={([v]) => setDeltaV(v)}
                      min={0}
                      max={10}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="flex-1"
                      variant={isPlaying ? "secondary" : "default"}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="flex-1"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Mission Status */}
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`glass-card p-6 border-2 ${
                    missionStatus === 'success'
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-red-500 bg-red-500/10'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {missionStatus === 'success' ? (
                      <>
                        <CheckCircle className="w-8 h-8 text-green-500 animate-pulse" />
                        <div>
                          <h3 className="font-bold text-green-500 text-lg">Earth Saved! 🌍</h3>
                          <p className="text-sm text-green-600">Deflection successful</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
                        <div>
                          <h3 className="font-bold text-red-500 text-lg">Impact Warning!</h3>
                          <p className="text-sm text-red-600">Deflection required</p>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Global Impact Predictions */}
              <ImpactPredictionPanel 
                impactData={impactData} 
                missionStatus={missionStatus}
              />
            </div>

            {/* Center - 3D Visualization */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-6 h-[600px]"
              >
                <h3 className="text-lg font-bold mb-4">3D Trajectory Visualization</h3>
                <div className="w-full h-full rounded-xl overflow-hidden">
                  <Canvas>
                    <PerspectiveCamera makeDefault position={[10, 8, 10]} fov={50} />
                    <ambientLight intensity={0.3} />
                    <pointLight position={[15, 15, 15]} intensity={1.5} />
                    <pointLight position={[-15, -5, -15]} intensity={0.5} color="#4488ff" />
                    
                    <Stars radius={300} depth={50} count={5000} factor={4} fade speed={1} />
                    
                    <Earth3D />
                    <Asteroid3D 
                      key={`${selectedAsteroid?.id}-${diameter}`}
                      position={[currentPosition.x, currentPosition.y, currentPosition.z]} 
                      size={mapDiameterToWorldSize(diameter)}
                      isDeflected={missionStatus === 'success'}
                    />
                    <OrbitPath 
                      semiMajorAxis={selectedAsteroid?.semiMajorAxis || 1.5}
                      eccentricity={selectedAsteroid?.eccentricity || 0.2}
                      isDeflected={missionStatus === 'success'}
                      showDeflectedPath={deltaV > 0}
                    />
                    
                    {showImpact && (
                      <ImpactParticles 
                        position={impactPosition} 
                        active={showImpact} 
                        scale={Math.max(0.8, mapDiameterToWorldSize(diameter) * 1.5)}
                      />
                    )}
                    
                    <OrbitControls 
                      enableZoom 
                      enablePan 
                      autoRotate={isPlaying}
                      autoRotateSpeed={0.5}
                      minDistance={5}
                      maxDistance={30}
                    />
                    
                    <SceneController
                      isPlaying={isPlaying}
                      asteroidData={selectedAsteroid || asteroidList[0]}
                      deflectionDeltaV={deltaV}
                      onPositionUpdate={handlePositionUpdate}
                    />
                  </Canvas>
                </div>
              </motion.div>

              {/* Live Data Dashboard */}
              {impactData && (
                <LiveDataPanel data={impactData} />
              )}

              {/* Impact Map */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6 h-[400px]"
              >
                <h3 className="text-lg font-bold mb-4">Impact Zone Prediction</h3>
                <div className="w-full h-full rounded-xl overflow-hidden">
                  <MapContainer
                    key={`${impactLocation[0]}-${impactLocation[1]}`}
                    center={impactLocation}
                    zoom={5}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; OpenStreetMap contributors'
                    />
                    {impactData && missionStatus === 'impact' && (
                      <Circle
                        center={impactLocation}
                        radius={parseFloat(impactData.craterSize) * 1000}
                        pathOptions={{ 
                          color: '#ef4444', 
                          fillColor: '#ef4444', 
                          fillOpacity: 0.4,
                          weight: 2
                        }}
                      >
                        <Popup>
                          <div className="text-sm font-bold">
                            <p className="text-red-600 mb-1">⚠️ Impact Zone</p>
                            <p>Crater: {impactData.craterSize.toFixed(2)} km</p>
                            <p>Energy: {impactData.impactEnergy.toFixed(2)} MT</p>
                            <p>Magnitude: {impactData.seismicMagnitude.toFixed(2)}</p>
                          </div>
                        </Popup>
                      </Circle>
                    )}
                  </MapContainer>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AsteroidSimulator;
