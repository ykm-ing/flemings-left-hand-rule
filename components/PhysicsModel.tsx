'use client';

import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
// Import only the Question type from quiz utility
import { Question } from '../utils/quiz';

// Component for rendering a thick 3D arrow
function ThickArrow({ start, direction, length = 1.5, color, label, visible = true }: { start: [number, number, number], direction: [number, number, number], length?: number, color: string, label: string, visible?: boolean }) {
  if (!visible) return null;

  const dir = new THREE.Vector3(...direction).normalize();
  const origin = new THREE.Vector3(...start);
  
  // Calculate rotation to align the arrow with the direction
  const defaultDir = new THREE.Vector3(0, 1, 0); // Cylinder/Cone primitive default axis
  const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultDir, dir);

  const shaftLength = length * 0.7;
  const headLength = length * 0.3;
  const shaftRadius = 0.15;
  const headRadius = 0.4;

  // Position for shaft center
  const shaftOffset = dir.clone().multiplyScalar(shaftLength / 2);
  const shaftPos = origin.clone().add(shaftOffset);

  // Position for head center
  const headOffset = dir.clone().multiplyScalar(shaftLength + headLength / 2);
  const headPos = origin.clone().add(headOffset);
  
  // Label position (at the tip)
  const labelPos = origin.clone().add(dir.multiplyScalar(length + 0.5));

  return (
    <group>
      <mesh position={shaftPos} quaternion={quaternion}>
        <cylinderGeometry args={[shaftRadius, shaftRadius, shaftLength, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={headPos} quaternion={quaternion}>
        <coneGeometry args={[headRadius, headLength, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Html position={labelPos} center>
        <div style={{ 
          background: color, 
          color: 'white', 
          padding: '4px 8px', 
          borderRadius: '4px',
          fontWeight: 'bold',
          fontSize: '14px',
          whiteSpace: 'nowrap',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.3)'
        }}>
          {label}
        </div>
      </Html>
    </group>
  );
}

function Magnet({ position, isNorth, showPolarity }: { position: [number, number, number], isNorth: boolean, showPolarity: boolean }) {
  const color = showPolarity ? (isNorth ? "#ff4d4d" : "#4d94ff") : "#888888";
  
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[1, 1.5, 1.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Html position={[0, 0, 0.8]} transform>
        <div style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: 'white',
          textShadow: '0 0 4px rgba(0,0,0,0.5)'
        }}>
          {showPolarity ? (isNorth ? 'N' : 'S') : '?'}
        </div>
      </Html>
    </group>
  );
}


function Scene({ question }: { question: Question }) {
  // Determine physics state from question
  // We need to reconstruct the full state because the question only has given + answer
  // But for the visualization, we need to know all 3 props (Field, Current, Force)
  // even if one is "hidden" (the answer).
  
  // Actually, let's pass the full state props from the parent or reconstruction.
  // Ideally, the 'question' object from generateQuestion should contain the 'scenario' details.
  // I will assume for now I can interpret the question object or I'll update quiz.ts to provide a 'scenario'.
  
  // Let's rely on the props passed to this component.
  // Wait, I need to update quiz.ts first to export the types properly or use a robust interface.
  // For now, I'll assume standard props.
  
  const { fieldDirection, currentDirection, forceDirection, hiddenFactor } = question.scenario;

  const isFieldRight = fieldDirection === 'right';
  const isCurrentOut = currentDirection === 'out'; // Fixed: use 'out' instead of 'forward'
  const isForceUp = forceDirection === 'up';

  const showMagnetPolarity = hiddenFactor !== 'field';

  return (
    <group>
      {/* Magnets */}
      {/* If Field is Right (Left -> Right), Left is N, Right is S */}
      <Magnet position={[-2.5, 0, 0]} isNorth={isFieldRight} showPolarity={showMagnetPolarity} />
      <Magnet position={[2.5, 0, 0]} isNorth={!isFieldRight} showPolarity={showMagnetPolarity} />

      {/* Wire */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 8, 16]} />
        <meshStandardMaterial color="#e5e7eb" metallic={0.5} roughness={0.5} />
      </mesh>

      {/* Force Arrow (Yellow/Orange) */}
      <ThickArrow 
        start={[0, 0, 0]} 
        direction={[0, isForceUp ? 1 : -1, 0]} 
        length={2}
        color="#f59e0b" 
        label="Force" 
        visible={hiddenFactor !== 'force'}
      />

      {/* Current Arrow (Blue) on the wire */}
      {/* Wire is along Z. Out is +Z, In is -Z */}
      {/* Offset x slightly so arrow is not inside the wire if wire is thick, but wire is 0.2 radius. Shaft is 0.15 radius. */}
      {/* Better to offset it along Y slightly to be "floating" near wire or just inside it if transparent? floating is better */}
      {/* Let's put it ON the wire, centred. */}
      <ThickArrow 
        start={[0, 0.3, isCurrentOut ? -1 : 1]} 
        direction={[0, 0, isCurrentOut ? 1 : -1]} 
        length={2}
        color="#3b82f6" 
        label={isCurrentOut ? "Current (Out)" : "Current (In)"}
        visible={hiddenFactor !== 'current'} 
      />

      {/* Field Arrows (Green) - Visual aid for magnetic field */}
      {hiddenFactor !== 'field' && (
        <group>
             {/* Use ThickArrow for field too? Maybe thinner arrows. let's use helpers for field lines to distinct them */}
             {[0.6, -0.6].map((y, i) => (
               <arrowHelper 
                 key={i}
                 args={[
                   new THREE.Vector3(isFieldRight ? 1 : -1, 0, 0), 
                   new THREE.Vector3(isFieldRight ? -1.5 : 1.5, y, 0), 
                   3, 
                   "#22c55e", 
                   0.6, 
                   0.3
                 ]} 
               />
             ))}
             {/* No label for field lines to reduce clutter, magnets show N/S */}
        </group>
      )}

      {/* Question Mark for missing factor */}
      {hiddenFactor === 'force' && (
        <Html position={[0, 1.5, 0]} center>
          <div style={{ fontSize: '60px', color: '#f59e0b', fontWeight: 'bold', textShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>?</div>
        </Html>
      )}
      {hiddenFactor === 'current' && (
        <Html position={[0, 0.5, 0]} center>
          <div style={{ fontSize: '60px', color: '#3b82f6', fontWeight: 'bold', textShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>?</div>
        </Html>
      )}
      {hiddenFactor === 'field' && (
        <Html position={[0, 0, 0]} center>
          <div style={{ fontSize: '60px', color: '#888888', fontWeight: 'bold', textShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>?</div>
        </Html>
      )}

    </group>
  );
}

export default function PracticalModel({ question }: { question: Question | null }) {
  if (!question) return null;

  return (
    <div style={{ width: '100%', height: '400px', touchAction: 'none' }}>
      <Canvas camera={{ position: [3, 2, 6], fov: 40 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Scene question={question} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}
