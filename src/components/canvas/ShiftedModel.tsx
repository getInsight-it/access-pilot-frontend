'use client'
import { CameraShake, OrbitControls, PresentationControls, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import {
  ChromaticAberration,
  EffectComposer,
  Noise,
  Scanline
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useRef } from 'react';
import { Group } from 'three';

const RGBShiftedModel: React.FC = () => {
  const { nodes, materials } = useGLTF('/capacete-transformed.glb');
  const aberrationRef = useRef<ChromaticAberration>(null);

  return (
    <>
      <Canvas className="canvasShift" camera={{ position: [0, 0, 13], fov: 25 }}>
        <color attach="background" args={['#000000']} />
        <OrbitControls />
        <ambientLight intensity={Math.PI} />
        <CameraShake />

        <EffectComposer>
        <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={[0.002, 0.002]}
            ref={aberrationRef}
        />
        <Noise opacity={0.1} />
        <Scanline density={1} />
        </EffectComposer>
        <PresentationControls>
        <group scale={3} position={[-0.04, 0.45, 0]}>
            {/* <mesh
            geometry={nodes.Cylinder003.geometry}
            material={materials['m_Smiley-v2']}
            />
            <mesh
            geometry={nodes.Cylinder003_1.geometry}
            material={materials.m_Outline}
            /> */}

        <mesh geometry={nodes.helmet.geometry} material={materials.Helmet34}>
            {/* <meshStandardMaterial color={lime} /> */}
        </mesh>
        <mesh geometry={nodes.bigode.geometry} material={materials['MI_Spongebob_Mustache.001']} />
        <mesh geometry={nodes.Cube001_Material002_0.geometry} material={materials['Material.002']} />
        <mesh geometry={nodes.Cube_Material004_0.geometry} material={materials['Material.004']} />
        <mesh geometry={nodes.Sphere001_Material001_0.geometry} material={materials['Material.001']} />
            
        </group>
        </PresentationControls>

      </Canvas>
    </>
  );
};

export default RGBShiftedModel;
