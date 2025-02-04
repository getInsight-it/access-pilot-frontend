// import * as THREE from 'three'
// import React from 'react'
// import { useGLTF, useAnimations } from '@react-three/drei'
// import { GLTF } from 'three-stdlib'

// type ActionName = 'RightEyeAction' | 'LeftEyeAction'

// interface GLTFAction extends THREE.AnimationClip {
//   name: ActionName
// }

// type GLTFResult = GLTF & {
//   nodes: {
//     Boy: THREE.Mesh
//     bigode: THREE.Mesh
//     helmet: THREE.Mesh
//     RightEye: THREE.Mesh
//     LeftEye: THREE.Mesh
//   }
//   materials: {
//     ['standardSurface1.001']: THREE.MeshStandardMaterial
//     ['MI_Spongebob_Mustache.001']: THREE.MeshStandardMaterial
//     Helmet34: THREE.MeshStandardMaterial
//   }
//   animations: GLTFAction[]
// }

// export function Head(props: JSX.IntrinsicElements['group']) {
//   const group = React.useRef<THREE.Group>(null)
//   const { nodes, materials, animations } = useGLTF('/head-transformed.glb') as GLTFResult
//   const { actions } = useAnimations(animations, group)
//   return (
//     <group ref={group} {...props} dispose={null}>
//       <group name="Scene">
//         <mesh name="Boy" geometry={nodes.Boy.geometry} material={materials['standardSurface1.001']} position={[-0.014, -0.503, 0.592]} />
//         <mesh name="bigode" geometry={nodes.bigode.geometry} material={materials['MI_Spongebob_Mustache.001']} position={[0, -1.834, 4.038]} />
//         <mesh name="helmet" geometry={nodes.helmet.geometry} material={materials.Helmet34} position={[0, 0.16, 0]} />
//         <mesh name="RightEye" geometry={nodes.RightEye.geometry} material={nodes.RightEye.material} position={[-0.945, -0.485, 4.409]} rotation={[0.099, 0, 0]} scale={2.871} />
//         <mesh name="LeftEye" geometry={nodes.LeftEye.geometry} material={nodes.LeftEye.material} position={[0.95, -0.485, 4.409]} rotation={[0.099, 0, 0]} scale={2.871} />
//       </group>
//     </group>
//   )
// }

// useGLTF.preload('/head-transformed.glb')



import { useRef, useState, useEffect, useCallback, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations, OrbitControls, Environment, Html } from '@react-three/drei'
import * as THREE from 'three'
import { GLTF } from 'three-stdlib'

type ActionName = 'RightEyeAction' | 'LeftEyeAction'

interface GLTFAction extends THREE.AnimationClip {
  name: ActionName
}

type GLTFResult = GLTF & {
  nodes: {
    Boy: THREE.Mesh
    bigode: THREE.Mesh
    helmet: THREE.Mesh
    RightEye: THREE.Mesh
    LeftEye: THREE.Mesh
  }
  materials: {
    ['standardSurface1.001']: THREE.MeshStandardMaterial
    ['MI_Spongebob_Mustache.001']: THREE.MeshStandardMaterial
    Helmet34: THREE.MeshStandardMaterial
  }
  animations: GLTFAction[]
}

function Head({ setHovered }: { setHovered: (hovered: boolean) => void }) {
  const group = useRef<THREE.Group>(null)
  const { nodes, materials, animations } = useGLTF('/models/head-transformed.glb') as GLTFResult
  const { actions, names } = useAnimations(animations, group)

  useEffect(() => {
    // Log available animations
    console.log("Available animations:", names)

    // Start the eye animations
    names.forEach((name) => {
      if (actions[name]) {
        actions[name].reset().play()
        actions[name].setLoop(THREE.LoopRepeat, Infinity)
      }
    })
  }, [actions, names])

  useFrame((state) => {
    if (group.current) {
      const t = state.clock.getElapsedTime()
      
      // Gentle floating animation
      group.current.position.y = Math.sin(t * 2) * 0.05

      // Smooth rotation based on mouse position
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, state.mouse.x * Math.PI * 0.5, 0.05)

    }
  })

  const handlePointerOver = useCallback(() => setHovered(true), [setHovered])
  const handlePointerOut = useCallback(() => setHovered(false), [setHovered])

  return (
    <group
      ref={group}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      dispose={null}
    >
      <group name="Scene" scale={0.16}>
        <mesh name="Boy" geometry={nodes.Boy.geometry} material={materials['standardSurface1.001']} position={[-0.014, -0.503, 0.592]}>
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh name="bigode" geometry={nodes.bigode.geometry} material={materials['MI_Spongebob_Mustache.001']} position={[0, -1.834, 4.038]} />
        <mesh name="helmet" geometry={nodes.helmet.geometry} material={materials.Helmet34} position={[0, 0.16, 0]} />
        <mesh name="RightEye" geometry={nodes.RightEye.geometry} material={nodes.RightEye.material} position={[-0.945, -0.485, 4.409]} rotation={[0.099, 0, 0]} scale={2.871}>
          <meshToonMaterial color="black" />
        </mesh>
        <mesh name="LeftEye" geometry={nodes.LeftEye.geometry} material={nodes.LeftEye.material} position={[0.95, -0.485, 4.409]} rotation={[0.099, 0, 0]} scale={2.871}>
          <meshToonMaterial color="black" />
        </mesh>
      </group>
    </group>
  )
}

function CameraController() {
  const { camera } = useThree()
  useFrame((state) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, state.mouse.x * 2, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, state.mouse.y * -4, 0.05)
    camera.lookAt(0, 0, 0)
  })
  return <OrbitControls enabled={false} enableZoom={false} enablePan={false} />
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="text-white text-2xl">Carregando...</div>
    </Html>
  )
}

function Scene() {
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered])

  return (
    <div className="w-full h-full ">
      <Canvas camera={{ position: [3, 0, 5], fov: 50 }}>
        <Suspense fallback={<LoadingFallback />}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <CameraController />
          <Head setHovered={setHovered} />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
      {/* <div className="absolute bottom-5 left-5 text-white text-xl font-bold">
        {hovered ? "Clique para piscar!" : "Mova o mouse para explorar!"}
      </div> */}
    </div>
  )
}

export default Scene

useGLTF.preload('/models/head-transformed.glb')



