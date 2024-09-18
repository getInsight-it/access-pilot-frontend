import React from 'react';
import { useGLTF } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';

interface PhoneProps extends GroupProps {}

export function Phone(props: PhoneProps) {
  const { nodes, materials } = useGLTF('/phone-transformed.glb') as any;

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={(nodes as any).iphonex.geometry}
        material={materials.PaletteMaterial001}
        position={[0, 1.563, 0]}
      />
      <mesh
        geometry={(nodes as any).FlashBG001.geometry}
        material={materials.PaletteMaterial002}
        position={[0.705, 2.59, -0.093]}
      />
      <mesh
        geometry={(nodes as any).SCREEN.geometry}
        material={materials['Display.002']}
        position={[0, 1.563, 0]}
      />
    </group>
  );
}

useGLTF.preload('/phone-transformed.glb');
