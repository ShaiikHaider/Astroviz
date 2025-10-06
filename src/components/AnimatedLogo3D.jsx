import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SpaceLogo = ({ isHovered }) => {
  const coreRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const particlesRef = useRef();
  const glowRef = useRef();
  const time = useRef(0);

  // Create particle system
  const particles = useMemo(() => {
    const particleCount = 50;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 1.5 + Math.random() * 0.5;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    
    return positions;
  }, []);

  useFrame((state, delta) => {
    time.current += delta;

    // Rotate core with pulsing effect
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.01;
      coreRef.current.rotation.x = Math.sin(time.current) * 0.1;
      const pulseScale = 1 + Math.sin(time.current * 2) * 0.05;
      coreRef.current.scale.setScalar(isHovered ? pulseScale * 1.15 : pulseScale);
    }

    // Rotate rings in opposite directions
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += 0.015;
      ring1Ref.current.rotation.x = Math.PI / 4;
    }
    
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= 0.012;
      ring2Ref.current.rotation.y = Math.PI / 4;
    }

    // Animate particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.008;
    }

    // Pulse glow
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.3 + Math.sin(time.current * 2) * 0.15;
      glowRef.current.scale.setScalar(1.8 + Math.sin(time.current * 1.5) * 0.1);
    }
  });

  return (
    <group>
      {/* Core sphere with gradient effect */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#c084fc"
          emissive="#c084fc"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Inner glow */}
      <mesh scale={1.3}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Outer glow halo */}
      <mesh ref={glowRef} scale={1.8}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial
          color="#c084fc"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Ring 1 - Purple */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1, 0.03, 16, 100]} />
        <meshBasicMaterial
          color="#c084fc"
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Ring 2 - Cyan */}
      <mesh ref={ring2Ref} rotation={[0, Math.PI / 4, 0]}>
        <torusGeometry args={[1.2, 0.025, 16, 100]} />
        <meshBasicMaterial
          color="#00d9ff"
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Particle system */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#ff006e"
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>

      {/* Lighting */}
      <pointLight position={[2, 2, 2]} intensity={1} color="#c084fc" />
      <pointLight position={[-2, -2, 2]} intensity={0.5} color="#00d9ff" />
      <pointLight position={[0, 0, 3]} intensity={0.8} color="#ff006e" />
    </group>
  );
};

const AnimatedLogo3D = ({ isHovered }) => {
  return (
    <div className="w-14 h-14">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.2} />
        <SpaceLogo isHovered={isHovered} />
      </Canvas>
    </div>
  );
};

export default AnimatedLogo3D;
