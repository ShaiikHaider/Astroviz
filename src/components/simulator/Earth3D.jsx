import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

const Earth3D = () => {
  const earthRef = useRef();
  const cloudsRef = useRef();
  const atmosphereRef = useRef();
  
  // Load Earth textures
  const earthTexture = useLoader(THREE.TextureLoader, 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg');
  const bumpTexture = useLoader(THREE.TextureLoader, 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg');
  const specularTexture = useLoader(THREE.TextureLoader, 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg');
  const cloudsTexture = useLoader(THREE.TextureLoader, 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png');
  
  // Rotate Earth and clouds
  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0012; // Clouds rotate slightly faster
    }
  });

  return (
    <group>
      {/* Enhanced ambient light for brightness */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 3, 5]} intensity={2} />
      <directionalLight position={[-5, -3, -5]} intensity={0.8} color="#6699ff" />
      
      {/* Realistic Earth with textures */}
      <Sphere ref={earthRef} args={[2, 64, 64]}>
        <meshPhongMaterial
          map={earthTexture}
          bumpMap={bumpTexture}
          bumpScale={0.05}
          specularMap={specularTexture}
          specular={new THREE.Color('#888888')}
          shininess={30}
          emissive={new THREE.Color('#111122')}
          emissiveIntensity={0.15}
        />
      </Sphere>
      
      {/* Cloud layer */}
      <Sphere ref={cloudsRef} args={[2.01, 64, 64]}>
        <meshPhongMaterial
          map={cloudsTexture}
          transparent
          opacity={0.4}
          depthWrite={false}
          side={THREE.FrontSide}
        />
      </Sphere>
      
      {/* Atmospheric glow (inner) */}
      <Sphere ref={atmosphereRef} args={[2.1, 32, 32]}>
        <meshBasicMaterial
          color="#4da6ff"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Outer atmospheric glow */}
      <Sphere args={[2.2, 32, 32]}>
        <meshBasicMaterial
          color="#80ccff"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Outermost glow for realistic atmosphere */}
      <Sphere args={[2.3, 32, 32]}>
        <meshBasicMaterial
          color="#a0d8ff"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
    </group>
  );
};

export default Earth3D;
