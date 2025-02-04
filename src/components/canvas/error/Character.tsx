import * as THREE from 'three'
import React from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { GLTF, SkeletonUtils } from 'three-stdlib'

type ActionName = 'Around' | 'Behind' | 'Dance' | 'Hiphop' | 'Idle'

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

export function Character(props: JSX.IntrinsicElements['group']) {
  const group = React.useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF('/models/character-transformed.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone) as GLTFResult
  const { actions } = useAnimations(animations, group)

  React.useEffect(() => {
    if (actions) {
      // Executa a animação "Idle" por padrão
      actions['Idle']?.play()
    }

    return () => {
      if (actions) {
        // Limpa todas as animações ao desmontar o componente
        Object.values(actions).forEach((action) => {
          if (action) action.stop()
        })
      }
    }
  }, [actions])

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group castShadow receiveShadow name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.001}>
          <primitive object={nodes.mixamorigHips} />
        </group>
        <skinnedMesh
          name="bigode"
          geometry={nodes.bigode.geometry}
          material={materials['MI_Spongebob_Mustache.001']}
          skeleton={nodes.bigode.skeleton}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.01}
          castShadow
          receiveShadow
        />
        <skinnedMesh
          name="Boy"
          geometry={nodes.Boy.geometry}
          material={materials['standardSurface1.001']}
          skeleton={nodes.Boy.skeleton}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.01}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={'white'} />
        </skinnedMesh>
        <skinnedMesh
          name="helmet"
          geometry={nodes.helmet.geometry}
          material={materials.Helmet34}
          skeleton={nodes.helmet.skeleton}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.01}
          castShadow
          receiveShadow
        />
      </group>
    </group>
  )
}

useGLTF.preload('/models/character-transformed.glb')
