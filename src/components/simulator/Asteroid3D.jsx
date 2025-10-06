import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Asteroid3D = ({ position, size, isDeflected }) => {
  const asteroidRef = useRef();
  const trailRef = useRef();
  const trailPositions = useRef([]);

  // Create irregular asteroid geometry
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(size, 1);
    const positionAttribute = geo.getAttribute('position');
    
    // Randomize vertices for irregular shape
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      const z = positionAttribute.getZ(i);
      
      const scale = 0.8 + Math.random() * 0.4;
      positionAttribute.setXYZ(i, x * scale, y * scale, z * scale);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, [size]);

  useFrame((state) => {
    if (asteroidRef.current) {
      // Rotate asteroid
      asteroidRef.current.rotation.x += 0.01;
      asteroidRef.current.rotation.y += 0.008;
      
      // Update trail
      if (trailPositions.current.length > 50) {
        trailPositions.current.shift();
      }
      trailPositions.current.push(asteroidRef.current.position.clone());
    }
  });

  return (
    <group>
      <mesh ref={asteroidRef} position={position} geometry={geometry}>
        <meshStandardMaterial
          color={isDeflected ? "#22c55e" : "#78716c"}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh position={position}>
        <sphereGeometry args={[size * 1.2, 16, 16]} />
        <meshBasicMaterial
          color={isDeflected ? "#22c55e" : "#ef4444"}
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  );
};

export default Asteroid3D;
