import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 500, color = 'hsl(210, 90%, 55%)' }: { count?: number; color?: string }) {
  const mesh = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    
    return { positions, velocities };
  }, [count]);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.03;
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
      
      const positions = mesh.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        positions[i * 3] += particles.velocities[i * 3];
        positions[i * 3 + 1] += particles.velocities[i * 3 + 1];
        positions[i * 3 + 2] += particles.velocities[i * 3 + 2];
        
        // Boundary check
        if (Math.abs(positions[i * 3]) > 25) particles.velocities[i * 3] *= -1;
        if (Math.abs(positions[i * 3 + 1]) > 25) particles.velocities[i * 3 + 1] *= -1;
        if (Math.abs(positions[i * 3 + 2]) > 25) particles.velocities[i * 3 + 2] *= -1;
      }
      
      mesh.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  const threeColor = useMemo(() => new THREE.Color(color), [color]);
  
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        color={threeColor} 
        transparent 
        opacity={0.4} 
        sizeAttenuation 
      />
    </points>
  );
}

function GridLines() {
  const gridRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });
  
  const lines = useMemo(() => {
    const result: THREE.Vector3[][] = [];
    const size = 20;
    const divisions = 10;
    
    for (let i = 0; i <= divisions; i++) {
      const pos = (i / divisions) * size - size / 2;
      result.push([
        new THREE.Vector3(pos, -10, -size / 2),
        new THREE.Vector3(pos, -10, size / 2)
      ]);
      result.push([
        new THREE.Vector3(-size / 2, -10, pos),
        new THREE.Vector3(size / 2, -10, pos)
      ]);
    }
    
    return result;
  }, []);
  
  return (
    <group ref={gridRef}>
      {lines.map((line, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([...line[0].toArray(), ...line[1].toArray()])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="hsl(210, 90%, 55%)" transparent opacity={0.1} />
        </line>
      ))}
    </group>
  );
}

export function ParticleField({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 z-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 20], fov: 75 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Particles count={300} color="hsl(210, 90%, 55%)" />
        <Particles count={200} color="hsl(160, 55%, 45%)" />
        <GridLines />
      </Canvas>
    </div>
  );
}
