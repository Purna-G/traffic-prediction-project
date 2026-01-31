import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Box, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Road() {
  const roadRef = useRef<THREE.Mesh>(null);
  
  return (
    <mesh ref={roadRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[40, 10]} />
      <meshStandardMaterial color="hsl(215, 25%, 15%)" roughness={0.8} />
    </mesh>
  );
}

function Car({ position, speed, color }: { position: [number, number, number]; speed: number; color: string }) {
  const carRef = useRef<THREE.Group>(null);
  const initialX = position[0];
  
  useFrame((state) => {
    if (carRef.current) {
      carRef.current.position.x = ((initialX + state.clock.elapsedTime * speed) % 30) - 15;
    }
  });
  
  return (
    <group ref={carRef} position={position}>
      {/* Car body */}
      <Box args={[1.2, 0.4, 0.6]} position={[0, 0.3, 0]}>
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
      </Box>
      {/* Car top */}
      <Box args={[0.6, 0.3, 0.5]} position={[0.1, 0.6, 0]}>
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
      </Box>
      {/* Wheels */}
      {[[-0.4, 0.1, 0.35], [0.4, 0.1, 0.35], [-0.4, 0.1, -0.35], [0.4, 0.1, -0.35]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
          <meshStandardMaterial color="hsl(0, 0%, 10%)" />
        </mesh>
      ))}
      {/* Headlights */}
      <pointLight position={[0.6, 0.3, 0]} intensity={0.5} color="#fff5e0" distance={3} />
    </group>
  );
}

function FloatingOrbs() {
  const colors = ['hsl(210, 90%, 55%)', 'hsl(160, 55%, 45%)', 'hsl(45, 90%, 55%)'];
  
  return (
    <>
      {colors.map((color, i) => (
        <Float
          key={i}
          speed={1.5 + i * 0.5}
          rotationIntensity={0.3}
          floatIntensity={0.5}
          position={[(i - 1) * 6, 2 + i * 0.5, -5 - i * 2]}
        >
          <Sphere args={[0.5 + i * 0.2, 32, 32]}>
            <MeshDistortMaterial
              color={color}
              attach="material"
              distort={0.3}
              speed={2}
              roughness={0.1}
              metalness={0.8}
            />
          </Sphere>
        </Float>
      ))}
    </>
  );
}

function DataPoints() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = Math.random() * 10 - 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
      
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        // Primary blue
        colors[i * 3] = 0.22;
        colors[i * 3 + 1] = 0.55;
        colors[i * 3 + 2] = 0.88;
      } else if (colorChoice < 0.66) {
        // Secondary green
        colors[i * 3] = 0.22;
        colors[i * 3 + 1] = 0.65;
        colors[i * 3 + 2] = 0.45;
      } else {
        // Accent yellow
        colors[i * 3] = 0.95;
        colors[i * 3 + 1] = 0.75;
        colors[i * 3 + 2] = 0.15;
      }
    }
    
    return { positions, colors };
  }, []);
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.08} vertexColors transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function Scene() {
  const carColors = [
    'hsl(210, 90%, 55%)', // Primary blue
    'hsl(160, 55%, 45%)', // Secondary green
    'hsl(0, 72%, 50%)',   // Red
    'hsl(45, 90%, 55%)',  // Yellow
    'hsl(280, 60%, 55%)', // Purple
  ];
  
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} color="#fff5e6" />
      <pointLight position={[-10, 5, -10]} intensity={0.5} color="hsl(210, 90%, 55%)" />
      <pointLight position={[10, 5, -10]} intensity={0.5} color="hsl(160, 55%, 45%)" />
      
      <Road />
      
      {/* Cars moving on road */}
      <Car position={[-10, -1.5, -1]} speed={2} color={carColors[0]} />
      <Car position={[-5, -1.5, 0]} speed={1.5} color={carColors[1]} />
      <Car position={[0, -1.5, 1]} speed={2.5} color={carColors[2]} />
      <Car position={[8, -1.5, 0]} speed={1.8} color={carColors[3]} />
      <Car position={[15, -1.5, -1]} speed={2.2} color={carColors[4]} />
      
      <FloatingOrbs />
      <DataPoints />
      
      <Environment preset="city" />
    </>
  );
}

export function TrafficScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 3, 12], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
