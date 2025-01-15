import * as THREE from 'three'
import React, { useEffect } from 'react'
import { useGraph, Canvas } from '@react-three/fiber'
import { useGLTF, useAnimations, Environment, Lightformer, ContactShadows, OrbitControls } from '@react-three/drei'
import { GLTF, SkeletonUtils } from 'three-stdlib'
import { useTheme } from '../layout/ThemeToggle/theme-provider'

type ActionName = 'headshake' | 'hiphop' | 'idle'

interface GLTFAction extends THREE.AnimationClip {
  name: ActionName
}

type GLTFResult = GLTF & {
    nodes: {
      bigode: THREE.SkinnedMesh
      Boy: THREE.SkinnedMesh
      helmet: THREE.SkinnedMesh
      mixamorigHips: THREE.Bone
    }
    materials: {
      ['MI_Spongebob_Mustache.001']: THREE.MeshStandardMaterial
      ['standardSurface1.001']: THREE.MeshStandardMaterial
      Helmet34: THREE.MeshStandardMaterial
    }
    animations: GLTFAction[]
  }

interface CharacterProps extends Omit<JSX.IntrinsicElements['group'], 'ref'> {
  currentAnimation: ActionName
}

function Character({ currentAnimation, ...props }: CharacterProps) {
  const group = React.useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF('/models/piloto-form-transformed.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone) as GLTFResult
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    const action = actions[currentAnimation]
    action?.reset().fadeIn(0.5).play()
    return () => {
      action?.fadeOut(0.5)
    }
  }, [currentAnimation, actions])

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorigHips} />
        </group>
        <skinnedMesh name="bigode" geometry={nodes.bigode.geometry} material={materials['MI_Spongebob_Mustache.001']} skeleton={nodes.bigode.skeleton} rotation={[Math.PI / 2, 0, 0]} scale={0.01} />
        <skinnedMesh name="Boy" geometry={nodes.Boy.geometry} material={materials['standardSurface1.001']} skeleton={nodes.Boy.skeleton} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
            <meshStandardMaterial color={'gray'} />
        </skinnedMesh>
        <skinnedMesh name="helmet" geometry={nodes.helmet.geometry} material={materials.Helmet34} skeleton={nodes.helmet.skeleton} rotation={[Math.PI / 2, 0, 0]} scale={0.01} />
      </group>
    </group>
  )
}

interface PersonagemProps {
  currentAnimation: ActionName
}

export function PilotoDetail({ currentAnimation }: PersonagemProps) {
  
  const { theme } = useTheme();
  
  // apartment, city, dawn, forest, lobby, night, park, studio, sunset, warehouse
  const environmentHDR = theme === 'dark'
    ? '/hdr/warehouse.hdr'
    : theme === 'tangerine'
    ? '/hdr/lobby.hdr'  // Caminho para o HDR do tema tangerine
    : '/hdr/park.hdr';  // Tema claro usa o HDR padrão

  return (
    <Canvas camera={{ position: [1, 2, 10], fov: 25 }}>
      <ambientLight intensity={Math.PI} />
      <Environment files={environmentHDR} />
      <Character
          currentAnimation={currentAnimation}
          scale={[0.095, 0.095, 0.095]}
          position={[-0.6, -1.5, 0]}
      />
      <ContactShadows position={[0, -1.51, 0]} opacity={0.2} scale={10} blur={2} far={10} resolution={256} color="#000000" />
      {/* <Environment background blur={0.75}>
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment> */}
    </Canvas>
  )
}

useGLTF.preload('/models/piloto-form-transformed.glb')

