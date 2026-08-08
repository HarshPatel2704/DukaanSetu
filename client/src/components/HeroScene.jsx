import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  PerspectiveCamera, 
  OrbitControls, 
  ContactShadows, 
  Environment, 
  MeshTransmissionMaterial,
  Box,
  Torus,
  Cylinder,
  Sphere
} from '@react-three/drei';
import * as THREE from 'three';

// --- Stylized Premium Products ---

const Phone = ({ jumpProgress }) => {
  const arc = Math.sin(jumpProgress * Math.PI) * 3;
  const pos = [THREE.MathUtils.lerp(5, 0, jumpProgress), arc - 0.2, 0];
  return (
    <group position={pos} rotation={[0, 0, jumpProgress * Math.PI * 2]}>
      <Box args={[0.4, 0.8, 0.05]}>
        <meshStandardMaterial color="#111" metalness={1} roughness={0.1} />
      </Box>
      <mesh position={[0, 0, 0.026]}>
        <planeGeometry args={[0.36, 0.76]} />
        <meshStandardMaterial color="#4361EE" emissive="#4361EE" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
};

const Watch = ({ jumpProgress }) => {
  const arc = Math.sin(jumpProgress * Math.PI) * 3.5;
  const pos = [THREE.MathUtils.lerp(-5, 0.2, jumpProgress), arc - 0.2, 0.2];
  return (
    <group position={pos} rotation={[jumpProgress * Math.PI, jumpProgress * Math.PI, 0]}>
      <Torus args={[0.15, 0.04, 16, 32]}>
        <meshStandardMaterial color="#FFD700" metalness={1} />
      </Torus>
      <Cylinder args={[0.12, 0.12, 0.02, 32]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#fff" />
      </Cylinder>
    </group>
  );
};

const Shoe = ({ jumpProgress }) => {
  const arc = Math.sin(jumpProgress * Math.PI) * 4;
  const pos = [THREE.MathUtils.lerp(0, -0.3, jumpProgress), arc - 0.2, THREE.MathUtils.lerp(5, -0.2, jumpProgress)];
  return (
    <group position={pos} rotation={[0, jumpProgress * Math.PI * 2, 0]}>
      <Box args={[0.6, 0.2, 0.3]} position={[0, -0.1, 0]}>
        <meshStandardMaterial color="#eee" />
      </Box>
      <Box args={[0.3, 0.3, 0.3]} position={[-0.15, 0.1, 0]}>
        <meshStandardMaterial color="#FF5A36" />
      </Box>
    </group>
  );
};

const ShoppingBag = ({ jumpProgress }) => {
  const arc = Math.sin(jumpProgress * Math.PI) * 3;
  const pos = [THREE.MathUtils.lerp(4, 0, jumpProgress), arc - 0.2, -0.3];
  return (
    <group position={pos} rotation={[0, 0, Math.sin(jumpProgress * Math.PI) * 0.2]}>
      <Box args={[0.6, 0.7, 0.3]}>
        <meshStandardMaterial color="#FF8A36" />
      </Box>
      <Torus args={[0.15, 0.02, 16, 32, Math.PI]} position={[0, 0.35, 0]} rotation={[0, 0, Math.PI]}>
        <meshStandardMaterial color="#333" />
      </Torus>
    </group>
  );
};

// --- Premium Shopping Cart ---

const Cart = ({ cartPos }) => {
  return (
    <group position={[cartPos, -1.5, 0]}>
      {/* Glossy Basket Body */}
      <mesh castShadow>
        <boxGeometry args={[2.2, 0.1, 1.4]} />
        <meshStandardMaterial color="#fff" metalness={0.5} roughness={0} />
      </mesh>
      
      {/* Glass Walls */}
      {[0.7, -0.7].map((z, i) => (
        <mesh key={i} position={[0, 0.5, z]}>
          <boxGeometry args={[2.2, 1, 0.05]} />
          <MeshTransmissionMaterial thickness={0.2} chromaticAberration={0.05} color="#ffffff" />
        </mesh>
      ))}
      {[1.1, -1.1].map((x, i) => (
        <mesh key={i+2} position={[x, 0.5, 0]}>
          <boxGeometry args={[0.05, 1, 1.4]} />
          <MeshTransmissionMaterial thickness={0.2} chromaticAberration={0.05} color="#ffffff" />
        </mesh>
      ))}

      {/* Premium Metallic Wheels */}
      {[-0.8, 0.8].map((x) => 
        [-0.5, 0.5].map((z, i) => (
          <group key={`${x}-${z}`} position={[x, -0.3, z]}>
            <Cylinder args={[0.2, 0.2, 0.1, 32]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="#222" metalness={1} roughness={0.1} />
            </Cylinder>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.12, 0.03, 16, 32]} />
              <meshStandardMaterial color="#FF5A36" emissive="#FF5A36" emissiveIntensity={2} />
            </mesh>
          </group>
        ))
      )}
    </group>
  );
};

// --- Main Scene ---

const SceneContent = () => {
  const [cartX, setCartX] = useState(10);
  const [jumps, setJumps] = useState([0, 0, 0, 0]); // Phone, Watch, Shoe, Bag

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // 1. Cart Entry (0s - 2s)
    if (t < 2) {
      setCartX(THREE.MathUtils.lerp(10, 0, t / 2));
    } else {
      setCartX(0);
    }

    // 2. Camera Zoom
    state.camera.position.z = THREE.MathUtils.lerp(12, 8, Math.min(t / 3, 1));
    state.camera.lookAt(0, 0, 0);

    // 3. Sequential Jumps
    const startJumps = 2.5;
    const duration = 0.8;
    const gap = 0.4;

    const newJumps = jumps.map((_, i) => {
      const startTime = startJumps + i * (duration + gap);
      if (t > startTime) {
        const p = (t - startTime) / duration;
        return Math.min(p, 1);
      }
      return 0;
    });
    setJumps(newJumps);
  });

  return (
    <group>
      <Cart cartPos={cartX} />
      
      {/* Products jumping into cart */}
      {jumps[0] > 0 && jumps[0] < 1 && <Phone jumpProgress={jumps[0]} />}
      {jumps[1] > 0 && jumps[1] < 1 && <Watch jumpProgress={jumps[1]} />}
      {jumps[2] > 0 && jumps[2] < 1 && <Shoe jumpProgress={jumps[2]} />}
      {jumps[3] > 0 && jumps[3] < 1 && <ShoppingBag jumpProgress={jumps[3]} />}

      {/* Static products in cart after jump */}
      <group position={[0, -1, 0]}>
        {jumps[0] >= 1 && <Phone jumpProgress={1} />}
        {jumps[1] >= 1 && <Watch jumpProgress={1} />}
        {jumps[2] >= 1 && <Shoe jumpProgress={1} />}
        {jumps[3] >= 1 && <ShoppingBag jumpProgress={1} />}
      </group>

      {/* Modern Showroom Environment */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.05} metalness={0.8} />
      </mesh>
      
      {/* Decorative Glows */}
      <mesh position={[0, -1.95, 0]}>
        <ringGeometry args={[4, 4.1, 64]} rotation={[-Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#4361EE" emissive="#4361EE" emissiveIntensity={5} />
      </mesh>

      <ContactShadows position={[0, -1.99, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
      <Environment preset="city" />
    </group>
  );
};

const HeroScene = () => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '650px', background: '#000' }}>
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 2, 12]} fov={35} />
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={10} castShadow />
        
        <SceneContent />

        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </div>
  );
};

export default HeroScene;
