import React, { FC } from 'react';
import { useGLTF } from '@react-three/drei';
import { Group } from 'three';

interface CharacterModelProps {
  // Defina quaisquer propriedades que possam ser passadas para o componente
}

const CharacterModel: FC<CharacterModelProps> = (props) => {
  const { nodes, materials } = useGLTF('/Demon.glb') as any;

  // Configurações de material
  for (const material in materials) {
    materials[material].metalness = -2;
    materials[material].roughness = 1;
  }

  return (
    <group name="Root_Scene">
      <group name="RootNode">
        <group name="CharacterArmature" rotation={[-Math.PI / 2, 0, 0]} scale={50} position={[0, -0.85, 0]}>
          <primitive object={nodes.Root} />
        </group>
        <group name="Demon" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <skinnedMesh
            name="Demon_1"
            geometry={nodes.Demon_1.geometry}
            material={materials.Demon_Main}
            skeleton={nodes.Demon_1.skeleton}
            receiveShadow
            castShadow
          />
          <skinnedMesh
            name="Demon_2"
            geometry={nodes.Demon_2.geometry}
            material={materials.Black}
            skeleton={nodes.Demon_2.skeleton}
            receiveShadow
            castShadow
          />
          <skinnedMesh
            name="Demon_3"
            geometry={nodes.Demon_3.geometry}
            material={materials.Eye_White}
            skeleton={nodes.Demon_3.skeleton}
            receiveShadow
            castShadow
          />
          <skinnedMesh
            name="Demon_4"
            geometry={nodes.Demon_4.geometry}
            material={materials.Eye_Black}
            skeleton={nodes.Demon_4.skeleton}
            receiveShadow
            castShadow
          />
        </group>
        <skinnedMesh
          name="Trident"
          geometry={nodes.Trident.geometry}
          material={materials.Black}
          skeleton={nodes.Trident.skeleton}
          position={[1.895, 1.734, -0.17]}
          scale={75.326}
          receiveShadow
          castShadow
        />
      </group>
    </group>
  );
};

useGLTF.preload('/Demon.glb');

export default CharacterModel;
