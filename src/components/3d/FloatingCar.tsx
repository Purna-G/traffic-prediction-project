import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function CarModel({ color = 'hsl(210, 90%, 55%)' }: { color?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });
  
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} scale={1.5}>
        {/* Main body */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[2, 0.5, 0.9]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Cabin */}
        <mesh position={[0.1, 0.7, 0]}>
          <boxGeometry args={[1, 0.4, 0.75]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Windows */}
        <mesh position={[0.1, 0.7, 0.38]}>
          <boxGeometry args={[0.9, 0.3, 0.02]} />
          <meshStandardMaterial color="hsl(200, 40%, 30%)" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.1, 0.7, -0.38]}>
          <boxGeometry args={[0.9, 0.3, 0.02]} />
          <meshStandardMaterial color="hsl(200, 40%, 30%)" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Wheels */}
        {[[-0.6, 0.1, 0.5], [0.6, 0.1, 0.5], [-0.6, 0.1, -0.5], [0.6, 0.1, -0.5]].map((pos, i) => (
          <group key={i} position={pos as [number, number, number]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.18, 0.18, 0.12, 24]} />
              <meshStandardMaterial color="hsl(0, 0%, 15%)" roughness={0.8} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.14, 24]} />
              <meshStandardMaterial color="hsl(0, 0%, 70%)" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))}
        
        {/* Headlights */}
        <mesh position={[1, 0.35, 0.3]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="hsl(50, 100%, 90%)" emissive="hsl(50, 100%, 70%)" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[1, 0.35, -0.3]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="hsl(50, 100%, 90%)" emissive="hsl(50, 100%, 70%)" emissiveIntensity={0.5} />
        </mesh>
        
        {/* Tail lights */}
        <mesh position={[-1, 0.35, 0.3]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="hsl(0, 80%, 50%)" emissive="hsl(0, 80%, 40%)" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[-1, 0.35, -0.3]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="hsl(0, 80%, 50%)" emissive="hsl(0, 80%, 40%)" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </Float>
  );
}

export function FloatingCar({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [3, 2, 5], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="hsl(210, 90%, 55%)" />
        
        <CarModel />
        
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
        />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
