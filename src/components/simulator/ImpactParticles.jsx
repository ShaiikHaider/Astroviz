import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ImpactParticles = ({ position, active, scale = 1 }) => {
  const fireballRef = useRef();
  const debrisRef = useRef();
  const shockwaveRef = useRef();
  const smokeRef = useRef();
  const timeRef = useRef(0);

  const particleCount = 3000; // Enhanced for game-like explosion
  const debrisCount = 800;
  const smokeCount = 500;
  
  const { positions, velocities, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = [];
    const cols = new Float32Array(particleCount * 3);
    const szs = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      // Start at impact point
      pos[i * 3] = position[0];
      pos[i * 3 + 1] = position[1];
      pos[i * 3 + 2] = position[2];
      
      // Random velocities (explosion pattern)
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = (0.08 + Math.random() * 0.25) * scale;
      
      vel.push({
        x: Math.sin(phi) * Math.cos(theta) * speed,
        y: Math.abs(Math.cos(phi) * speed) * 1.2,
        z: Math.sin(phi) * Math.sin(theta) * speed,
      });
      
      // Color gradient: orange to red to yellow
      const colorMix = Math.random();
      if (colorMix < 0.33) {
        cols[i * 3] = 1; // R
        cols[i * 3 + 1] = 0.3 + Math.random() * 0.3; // G
        cols[i * 3 + 2] = 0; // B
      } else if (colorMix < 0.66) {
        cols[i * 3] = 1;
        cols[i * 3 + 1] = 0.1 + Math.random() * 0.2;
        cols[i * 3 + 2] = 0;
      } else {
        cols[i * 3] = 1;
        cols[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        cols[i * 3 + 2] = 0;
      }
      
      // Varying sizes
      szs[i] = (0.05 + Math.random() * 0.15) * Math.max(0.8, Math.min(scale, 3));
    }
    
    return { positions: pos, velocities: vel, colors: cols, sizes: szs };
  }, [position, active, scale]);

  const { debrisPositions, debrisVelocities } = useMemo(() => {
    const pos = new Float32Array(debrisCount * 3);
    const vel = [];
    
    for (let i = 0; i < debrisCount; i++) {
      pos[i * 3] = position[0];
      pos[i * 3 + 1] = position[1];
      pos[i * 3 + 2] = position[2];
      
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = (0.03 + Math.random() * 0.12) * scale;
      
      vel.push({
        x: Math.sin(phi) * Math.cos(theta) * speed,
        y: Math.abs(Math.cos(phi) * speed) * 0.8,
        z: Math.sin(phi) * Math.sin(theta) * speed,
      });
    }
    
    return { debrisPositions: pos, debrisVelocities: vel };
  }, [position, active, scale]);

  const { smokePositions, smokeVelocities } = useMemo(() => {
    const pos = new Float32Array(smokeCount * 3);
    const vel = [];
    
    for (let i = 0; i < smokeCount; i++) {
      pos[i * 3] = position[0];
      pos[i * 3 + 1] = position[1];
      pos[i * 3 + 2] = position[2];
      
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = (0.02 + Math.random() * 0.08) * scale;
      
      vel.push({
        x: Math.sin(phi) * Math.cos(theta) * speed,
        y: Math.abs(Math.cos(phi) * speed) * 0.5,
        z: Math.sin(phi) * Math.sin(theta) * speed,
      });
    }
    
    return { smokePositions: pos, smokeVelocities: vel };
  }, [position, active, scale]);

  useFrame((state, delta) => {
    if (!active) return;
    
    timeRef.current += delta;
    const progress = timeRef.current / 5; // Extended to 5 seconds for dramatic effect
    const time = state.clock.getElapsedTime();
    
    // Game-like acceleration curve for explosion
    const explosionForce = Math.max(0, 1 - progress * 0.5);
    const acceleration = 1 + progress * 2;
    
    // Animate fireball particles with acceleration
    if (fireballRef.current) {
      const positionAttribute = fireballRef.current.geometry.getAttribute('position');
      
      for (let i = 0; i < particleCount; i++) {
        const vel = velocities[i];
        
        // Particles accelerate outward then slow down
        positionAttribute.setX(i, positionAttribute.getX(i) + vel.x * acceleration);
        positionAttribute.setY(i, positionAttribute.getY(i) + vel.y * acceleration - 0.004); // Gravity
        positionAttribute.setZ(i, positionAttribute.getZ(i) + vel.z * acceleration);
      }
      
      positionAttribute.needsUpdate = true;
      
      // Multi-stage fade with flash effect
      if (progress < 0.1) {
        fireballRef.current.material.opacity = 1.0;
      } else {
        fireballRef.current.material.opacity = Math.max(0, 1 - progress);
      }
    }
    
    // Animate debris with dramatic movement
    if (debrisRef.current) {
      const positionAttribute = debrisRef.current.geometry.getAttribute('position');
      
      for (let i = 0; i < debrisCount; i++) {
        const vel = debrisVelocities[i];
        
        positionAttribute.setX(i, positionAttribute.getX(i) + vel.x * explosionForce * 1.5);
        positionAttribute.setY(i, positionAttribute.getY(i) + vel.y * explosionForce * 1.5 - 0.005); // More gravity
        positionAttribute.setZ(i, positionAttribute.getZ(i) + vel.z * explosionForce * 1.5);
      }
      
      positionAttribute.needsUpdate = true;
      debrisRef.current.material.opacity = Math.max(0, 0.9 - progress);
    }
    
    // Animate smoke with billowing effect
    if (smokeRef.current) {
      const positionAttribute = smokeRef.current.geometry.getAttribute('position');
      
      for (let i = 0; i < smokeCount; i++) {
        const vel = smokeVelocities[i];
        const drift = Math.sin(time * 2 + i) * 0.02;
        
        positionAttribute.setX(i, positionAttribute.getX(i) + vel.x * 0.6 + drift);
        positionAttribute.setY(i, positionAttribute.getY(i) + vel.y * 0.6 + 0.01);
        positionAttribute.setZ(i, positionAttribute.getZ(i) + vel.z * 0.6);
      }
      
      positionAttribute.needsUpdate = true;
      smokeRef.current.material.opacity = Math.max(0, 0.7 - progress * 0.7);
    }
    
    // Multi-stage shockwave expansion (game-like)
    if (shockwaveRef.current) {
      if (progress < 0.3) {
        // Rapid initial expansion
        const scale = 1 + progress * 30;
        shockwaveRef.current.scale.set(scale, scale, scale);
        shockwaveRef.current.material.opacity = 0.9;
      } else {
        // Slower dissipation
        const scale = 10 + (progress - 0.3) * 15;
        shockwaveRef.current.scale.set(scale, scale, scale);
        shockwaveRef.current.material.opacity = Math.max(0, 0.8 - progress);
      }
    }
    
    // Reset after 5 seconds
    if (timeRef.current > 5) {
      timeRef.current = 0;
    }
  });

  if (!active) return null;

  return (
    <group>
      {/* Fireball particles */}
      <points ref={fireballRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particleCount}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15 * Math.max(0.8, scale)}
          vertexColors
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
      
      {/* Debris particles */}
      <points ref={debrisRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={debrisCount}
            array={debrisPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06 * Math.max(0.8, scale)}
          color="#6b4423"
          transparent
          opacity={0.8}
          blending={THREE.NormalBlending}
        />
      </points>
      
      {/* Smoke particles */}
      <points ref={smokeRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={smokeCount}
            array={smokePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.2 * Math.max(0.8, scale)}
          color="#333333"
          transparent
          opacity={0.6}
          blending={THREE.NormalBlending}
        />
      </points>
      
      {/* Shockwave ring */}
      <mesh ref={shockwaveRef} position={position}>
        <ringGeometry args={[0.3 * Math.max(0.8, scale), 0.5 * Math.max(0.8, scale), 32]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Central flash - Enhanced */}
      <mesh position={position}>
        <sphereGeometry args={[0.5 * Math.max(0.8, scale), 16, 16]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Secondary flash ring */}
      <mesh position={position}>
        <sphereGeometry args={[0.8 * Math.max(0.8, scale), 16, 16]} />
        <meshBasicMaterial
          color="#ff9900"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

export default ImpactParticles;
