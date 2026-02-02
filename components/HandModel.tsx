'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

interface HandModelProps {
  showLabels?: boolean;
  highlightFinger?: 'thumb' | 'first' | 'second' | null;
}

function Hand3D({ showLabels, highlightFinger }: HandModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Colors for highlighting
  const thumbColor = highlightFinger === 'thumb' ? '#ff6b6b' : '#ffd93d';
  const firstColor = highlightFinger === 'first' ? '#6bcf7f' : '#95e1d3';
  const secondColor = highlightFinger === 'second' ? '#4d96ff' : '#a8dadc';

  return (
    <group ref={groupRef} rotation={[0.3, -0.5, 0]}>
      {/* Palm */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 0.3, 2.5]} />
        <meshStandardMaterial color="#f4a582" />
      </mesh>

      {/* Thumb - Perpendicular (Force/Motion) */}
      <group position={[-1.2, 0.5, 0]}>
        <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 1.5, 16]} />
          <meshStandardMaterial color={thumbColor} />
        </mesh>
        <mesh position={[0, 1.1, 0]}>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshStandardMaterial color={thumbColor} />
        </mesh>
        {showLabels && (
          <Html position={[0, 1.8, 0]} center>
            <div style={{
              background: 'rgba(255, 107, 107, 0.9)',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}>
              Thumb: Force/Motion
            </div>
          </Html>
        )}
      </group>

      {/* First Finger - Points up (Magnetic Field) */}
      <group position={[-0.3, 0, 1.3]}>
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 2, 16]} />
          <meshStandardMaterial color={firstColor} />
        </mesh>
        <mesh position={[0, 2.2, 0]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color={firstColor} />
        </mesh>
        {showLabels && (
          <Html position={[0, 2.8, 0]} center>
            <div style={{
              background: 'rgba(107, 207, 127, 0.9)',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}>
              First Finger: Magnetic Field
            </div>
          </Html>
        )}
      </group>

      {/* Second Finger - Points forward (Current) */}
      <group position={[0.3, 0, 1.3]}>
        <mesh position={[0, 0, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 2.5, 16]} />
          <meshStandardMaterial color={secondColor} />
        </mesh>
        <mesh position={[0, 0, 2.6]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color={secondColor} />
        </mesh>
        {showLabels && (
          <Html position={[0, 0, 3.3]} center>
            <div style={{
              background: 'rgba(77, 150, 255, 0.9)',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}>
              Second Finger: Current
            </div>
          </Html>
        )}
      </group>

      {/* Other fingers (curled) */}
      <group position={[0.8, 0, 0.8]}>
        <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 4, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.8, 16]} />
          <meshStandardMaterial color="#f4a582" />
        </mesh>
      </group>
      <group position={[1.2, 0, 0.5]}>
        <mesh position={[0, 0.25, 0]} rotation={[Math.PI / 4, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.7, 16]} />
          <meshStandardMaterial color="#f4a582" />
        </mesh>
      </group>
    </group>
  );
}

export default function HandModel({ showLabels = true, highlightFinger = null }: HandModelProps) {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px' }}>
      <Canvas camera={{ position: [5, 3, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />
        <Hand3D showLabels={showLabels} highlightFinger={highlightFinger} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={15}
        />
        <gridHelper args={[10, 10, '#cccccc', '#eeeeee']} position={[0, -2, 0]} />
      </Canvas>
    </div>
  );
}
