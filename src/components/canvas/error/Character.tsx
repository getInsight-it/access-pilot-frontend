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
  const { scene, animations } = useGLTF('/character-transformed.glb')
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
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.001}>
          <primitive object={nodes.mixamorigHips} />
        </group>
        <skinnedMesh
          name="bigode"
          geometry={nodes.bigode.geometry}
          material={materials['MI_Spongebob_Mustache.001']}
          skeleton={nodes.bigode.skeleton}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.01}
        />
        <skinnedMesh
          name="Boy"
          geometry={nodes.Boy.geometry}
          material={materials['standardSurface1.001']}
          skeleton={nodes.Boy.skeleton}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.01}
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
        />
      </group>
    </group>
  )
}

useGLTF.preload('/character-transformed.glb')
