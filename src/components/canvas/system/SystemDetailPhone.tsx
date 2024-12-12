import * as THREE from 'three'
import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, Environment, useGLTF, ContactShadows, OrbitControls, Loader } from '@react-three/drei'
import HeroPhone from './HeroPhone'

function Model(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(null)
  const { nodes, materials } = useGLTF('/models/phone-transformed.glb') as unknown as any

  useFrame((state) => {
    if (group.current) {
      const t = state.clock.getElapsedTime()
      group.current.rotation.x = - THREE.MathUtils.lerp(group.current.rotation.x, Math.cos(t / 2) / 20 + 0.25, 0.5)
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, Math.sin(t / 4) / 10, 0.1)
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, Math.sin(t / 8) / 20, 0.1)
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, (-2 + Math.sin(t / 2)) / 2, 0.1)
    }
  })

  return (
    <group ref={group} {...props} dispose={null}>
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
        material={new THREE.MeshStandardMaterial({
          ...materials['Display.002'],
          side: THREE.DoubleSide, // Renderizar dos dois lados
          transparent: true,
          opacity: 0.0,
          depthWrite: true,
          depthTest: true,
        })}
        position={[0, 1.563, 0]}
      >
        <Html
          className="hero-phone-content nobar"
          position={[0.18, -0.2, 0.01]} // Ajuste a posição para ficar levemente à frente da tela
          transform
          occlude="blending"
          zIndexRange={[10, 0]} // Garante que o HTML renderize acima da tela
        >
          <div className="hero-phone-wrapper" onPointerDown={(e) => e.stopPropagation()}>
            <HeroPhone />
          </div>
        </Html>
      </mesh>
    </group>
  )
}

export default function SystemPhone() {

  const container = {
    backgroundColor: 'white',
    color: 'black'
  }

  const data = {
    color: 'black'
  }

  return (
    <>
      <Suspense fallback={
        <Loader
          containerStyles={container}
          dataStyles={data}
        />
      }>
        <Canvas className="" camera={{ position: [-2, 0, -10], fov: 60 }}>
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <group rotation={[0, Math.PI, 0]}  position={[0, -2, 0]}>
            <Model scale={[2.2, 2.2, 2.2]} />
          </group>
          <Environment preset="city" />
          <ContactShadows position={[0, -4.4, 0]} opacity={0.5} scale={20} blur={2} far={4.5} />
          <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2.2} maxPolarAngle={Math.PI / 2.2} />
        </Canvas>
      </Suspense>
    </>
  )
}
