'use client'
import React, { FC } from 'react';
import { useGLTF } from '@react-three/drei';
import { Group } from 'three';

interface ModelProps {
  // Defina quaisquer propriedades que possam ser passadas para o componente
}

const Piloto: FC<ModelProps> = (props) => {
  const { nodes, materials } = useGLTF('/piloto-transformed.glb') as any;

  // Configurações de material
  for (const material in materials) {
    materials[material].metalness = -2;
    materials[material].roughness = 1;
  }

  return (
    <group>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.001} position={[0, -0.86, 0]}>
          <primitive object={nodes.mixamorigHips} />
        </group>
        <skinnedMesh
          name="bigode"
          geometry={nodes.bigode.geometry}
          material={materials['MI_Spongebob_Mustache.001']}
          skeleton={nodes.bigode.skeleton}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.01}
          receiveShadow
          castShadow
        >
          {/* <meshStandardMaterial color={"black"} /> */}
        </skinnedMesh>
        <skinnedMesh
          name="Boy"
          geometry={nodes.Boy.geometry}
        //   material={materials['standardSurface1.001']}
          skeleton={nodes.Boy.skeleton}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.01}
          receiveShadow
          castShadow
        >
          <meshStandardMaterial color={"white"} />
        </skinnedMesh>
        <skinnedMesh
          name="helmet"
          geometry={nodes.helmet.geometry}
          material={materials.Helmet34}
          skeleton={nodes.helmet.skeleton}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.01}
          receiveShadow
          castShadow
        >
          {/* <meshStandardMaterial color={"red"} /> */}
        </skinnedMesh>
      </group>
    </group>
  );
};

useGLTF.preload('/piloto-transformed.glb')

export default Piloto;
