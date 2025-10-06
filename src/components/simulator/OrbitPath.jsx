import { useMemo } from 'react';
import * as THREE from 'three';

const OrbitPath = ({ semiMajorAxis, eccentricity, isDeflected, showDeflectedPath }) => {
  const orbitPoints = useMemo(() => {
    const points = [];
    const segments = 100;
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const r = semiMajorAxis * (1 - eccentricity * eccentricity) / 
                (1 + eccentricity * Math.cos(angle));
      
      points.push(new THREE.Vector3(
        r * Math.cos(angle) * 3,
        0,
        r * Math.sin(angle) * 3
      ));
    }
    
    return points;
  }, [semiMajorAxis, eccentricity]);

  const deflectedOrbitPoints = useMemo(() => {
    if (!showDeflectedPath) return [];
    
    const points = [];
    const segments = 100;
    const newEccentricity = eccentricity * 1.3; // Modified orbit
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const r = semiMajorAxis * (1 - newEccentricity * newEccentricity) / 
                (1 + newEccentricity * Math.cos(angle));
      
      points.push(new THREE.Vector3(
        r * Math.cos(angle) * 3,
        0.5,
        r * Math.sin(angle) * 3
      ));
    }
    
    return points;
  }, [semiMajorAxis, eccentricity, showDeflectedPath]);

  return (
    <group>
      {/* Original orbit */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={orbitPoints.length}
            array={new Float32Array(orbitPoints.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial 
          color={isDeflected ? "#ef4444" : "#fbbf24"} 
          linewidth={2}
          transparent
          opacity={0.6}
        />
      </line>
      
      {/* Deflected orbit path */}
      {showDeflectedPath && deflectedOrbitPoints.length > 0 && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={deflectedOrbitPoints.length}
              array={new Float32Array(deflectedOrbitPoints.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial 
            color="#22c55e" 
            linewidth={2}
            transparent
            opacity={0.8}
          />
        </line>
      )}
    </group>
  );
};

export default OrbitPath;
