import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Telescope, Target, Rocket, ChevronDown } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import spaceBackground from '../assets/space-background.jpg';

// Simple 3D Asteroid component with scroll-based scaling
const Asteroid3D = ({ scrollProgress }) => {
  const meshRef = useRef();
  const groupRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Continuous rotation
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.2;
    }
    
    if (groupRef.current && scrollProgress !== undefined) {
      // Scale based on scroll (0.2 to 2.0)
      const scale = 0.2 + scrollProgress * 1.8;
      groupRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#888" roughness={0.8} metalness={0.2} />
      </mesh>
    </group>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Scene transitions based on scroll
  const scene1Opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scene2Opacity = useTransform(scrollYProgress, [0.15, 0.35, 0.45], [0, 1, 0]);
  const scene3Opacity = useTransform(scrollYProgress, [0.4, 0.6, 0.7], [0, 1, 0]);
  const scene4Opacity = useTransform(scrollYProgress, [0.65, 0.85], [0, 1]);

  // Convert scroll progress to plain number for Three.js
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(v => {
      setScrollProgress(Math.min(v / 0.3, 1)); // 0 to 1 for first 30% of scroll
    });
    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <>
      <Navbar />
      
      <div ref={containerRef} className="relative" style={{ height: '400vh' }}>
        
        {/* Top Title - Scrolls naturally over space background */}
        <div className="absolute top-32 left-1/2 -translate-x-1/2 z-30 text-center px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" style={{ textShadow: '0 0 30px rgba(255,255,255,0.8), 0 4px 6px rgba(0,0,0,0.5)' }}>
            {['ASTROVIZ', '-', '3D', 'Based', 'Asteroid', 'Simulator'].map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ 
                  delay: index * 0.2,
                  duration: 0.8,
                  ease: "easeOut"
                }}
                className="inline-block mr-2"
              >
                {word}
              </motion.span>
            ))}
          </h1>
        </div>
        {/* Fixed viewport for scenes */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          
          {/* Full Page Background Image with Shine Effect */}
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${spaceBackground})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Shiny overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 animate-pulse" />
          </div>

          {/* Swipe Down indicator */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <div className="px-4 py-2 rounded-full bg-background/60 border border-border backdrop-blur-sm animate-pulse flex items-center gap-2">
              <span className="text-sm md:text-base font-semibold">Swipe down</span>
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>

          {/* Scene 1 - Silent Beginning */}
          <motion.div
            style={{ opacity: scene1Opacity }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <p className="text-xl md:text-2xl text-muted-foreground mb-4">It begins as a silent rock…</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              <p className="text-xl md:text-2xl text-muted-foreground mb-4">Drifting in the vastness of space…</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 1 }}
            >
              <p className="text-xl md:text-2xl text-muted-foreground">Unnoticed. Unseen.</p>
            </motion.div>
          </motion.div>

          {/* Scene 2 - Discovery */}
          <motion.div
            style={{ opacity: scene2Opacity }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10"
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 rounded-full border-2 border-primary"
                style={{ width: '300px', height: '300px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
              />
              <Telescope className="w-24 h-24 text-primary mb-6 animate-pulse-glow" />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 mt-8"
            >
              <p className="text-lg md:text-xl text-foreground font-mono">
                <span className="text-primary">NASA</span> has detected a Near-Earth Object.
              </p>
              <p className="text-lg md:text-xl text-muted-foreground font-mono">
                Preliminary analysis in progress…
              </p>
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="flex items-center justify-center gap-2 text-destructive font-bold text-xl"
              >
                <AlertTriangle className="w-6 h-6" />
                <span>⚠ Estimated Time to Impact: 187 days</span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Scene 3 - Threat Revealed */}
          <motion.div
            style={{ opacity: scene3Opacity }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10 bg-gradient-to-b from-transparent via-destructive/10 to-transparent"
          >
            <Target className="w-32 h-32 text-destructive mb-6 animate-pulse-glow" />
            <motion.div className="space-y-6">
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-3xl md:text-5xl font-bold text-destructive"
              >
                Trajectory confirmed.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="text-3xl md:text-5xl font-bold text-foreground"
              >
                Target: <span className="text-primary">Earth</span>
              </motion.p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '300px' }}
                transition={{ delay: 1, duration: 1 }}
                className="h-1 bg-gradient-to-r from-destructive to-primary mx-auto rounded-full"
              />
            </motion.div>
          </motion.div>

          {/* Scene 4 - Call to Action */}
          <motion.div
            style={{ opacity: scene4Opacity }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10"
          >
            <Rocket className="w-24 h-24 text-primary mb-8 animate-float" />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 max-w-3xl"
            >
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-glow">
                Humanity faces a global threat.
              </h1>
              <p className="text-xl md:text-2xl text-foreground">
                You are the <span className="text-primary font-bold">Mission Commander</span>.
              </p>
              <p className="text-2xl md:text-3xl font-bold text-foreground">
                Can you save Earth?
              </p>
              
              {/* Neon Button */}
              <motion.button
                onClick={() => navigate('/simulator')}
                className="relative group mt-8 px-8 py-4 text-xl font-bold text-white rounded-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Animated gradient background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{ backgroundSize: '200% 200%' }}
                />
                
                {/* Glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 blur-xl bg-gradient-to-r from-primary via-secondary to-accent" />
                </div>
                
                {/* Button text */}
                <span className="relative z-10 flex items-center gap-3">
                  Launch Simulator
                  <Rocket className="w-6 h-6" />
                </span>
                
                {/* Border glow */}
                <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-primary transition-all duration-300" />
              </motion.button>
              
              <p className="text-sm text-muted-foreground mt-4">
                Scroll down to begin your mission
              </p>
            </motion.div>
          </motion.div>

          {/* 3D Background with Asteroid - Overlay on top of image */}
          <div className="absolute inset-0 z-[5] pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <Stars radius={300} depth={50} count={5000} factor={4} fade speed={1} />
              <Asteroid3D scrollProgress={scrollProgress} />
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
          </div>
        </div>
      </div>
      
      {/* Content after scroll section */}
      <div className="relative z-10 bg-background">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Explore AstroViz</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover, simulate, and understand asteroid threats using real NASA data
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -10 }}
              className="p-6 rounded-xl bg-card border border-border hover:border-primary transition-all"
            >
              <Telescope className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Explore Asteroids</h3>
              <p className="text-muted-foreground">
                Browse detailed profiles of 50+ near-Earth asteroids with real NASA imagery and data
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="p-6 rounded-xl bg-card border border-border hover:border-secondary transition-all"
            >
              <Target className="w-12 h-12 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-2">Impact Simulator</h3>
              <p className="text-muted-foreground">
                Run real-time simulations of asteroid impacts with 3D visualization and physics calculations
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="p-6 rounded-xl bg-card border border-border hover:border-accent transition-all"
            >
              <Rocket className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-bold mb-2">Defense Strategies</h3>
              <p className="text-muted-foreground">
                Test planetary defense methods including kinetic impactors and gravity tractors
              </p>
            </motion.div>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default Home;
