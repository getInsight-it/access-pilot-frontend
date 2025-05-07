import * as THREE from 'three'
import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, Environment, useGLTF, ContactShadows, OrbitControls, Loader } from '@react-three/drei'
import Hero from './Hero'
import { useTheme } from '../../layout/ThemeToggle/theme-provider'

function Model(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(null)
  const { nodes, materials } = useGLTF('/models/mac-draco.glb') as unknown as any

  const lidRef = useRef<THREE.Group>(null)
  const [isOpen, setIsOpen] = useState(true)

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  // const handleClick = () => {
  //   setTimeout(() => {
  //     setIsOpen(!isOpen)
  //   }, 500) // 500ms delay
  // }


  // Control lid animation
  useFrame((state) => {
    if (group.current && lidRef.current) {
      const targetRotation = isOpen ? -0.425 : 1.57
      lidRef.current.rotation.x = THREE.MathUtils.lerp(lidRef.current.rotation.x, targetRotation, 0.1)
    }
  })


  useFrame((state) => {
    if (group.current) {
      const t = state.clock.getElapsedTime()
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, Math.cos(t / 2) / 20 + 0.25, 0.1)
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, Math.sin(t / 4) / 20, 0.1)
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, Math.sin(t / 8) / 20, 0.1)
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, (-2 + Math.sin(t / 2)) / 2, 0.1)
    }
  })

  return (
    <group ref={group} {...props} dispose={null}>
      <group
        // tampa fechada
        // rotation-x={1.57}
        ref={lidRef}
        // inicialmente definido para a tampa fechada, mas será animado
        rotation-x={1.57}
        position={[0, -0.04, 0.41]}
        onClick={handleClick}
      >
        <group position={[0, 2.96, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh material={materials.aluminium} geometry={nodes.Cube008.geometry} />
          <mesh material={materials['matte.001']} geometry={nodes.Cube008_1.geometry} />
          <mesh geometry={nodes.Cube008_2.geometry}>
            {/* Drei's HTML component can "hide behind" canvas geometry */}
            <Html className="hero-content" rotation-x={-Math.PI / 2} position={[0, 0.05, -0.09]} transform occlude>
              <div className="hero-wrapper" onPointerDown={(e) => e.stopPropagation()}>
                {/* <HeroPage /> */}
                <Hero />
              </div>
            </Html>
          </mesh>
        </group>
      </group>
      {/* teclado */}
      <mesh material={materials.keys} geometry={nodes.keyboard.geometry} position={[1.79, 0, 3.45]} />
      <group position={[0, -0.1, 3.39]}>
        <mesh material={materials.aluminium} geometry={nodes.Cube002.geometry} />
        <mesh onClick={handleClick} material={materials.trackpad} geometry={nodes.Cube002_1.geometry} />
      </group>
      {/* touchbar */}
      <mesh material={materials.touchbar} geometry={nodes.touchbar.geometry} position={[0, -0.03, 1.2]} />
    </group>
  )
}

export default function System() {

  const container = {
    backgroundColor: 'white',
    color: 'black'
  }

  const data = {
    color: 'black'
  }

  const { theme } = useTheme();

  // apartment, city, dawn, forest, lobby, night, park, studio, sunset, warehouse
  const environmentHDR = theme === 'dark'
    ? '/hdr/warehouse.hdr'
    : theme === 'tangerine'
    ? '/hdr/lobby.hdr'  // Caminho para o HDR do tema tangerine
    : '/hdr/city.hdr';  // Tema claro usa o HDR padrão

  return (
    <>
      <Suspense fallback={
        <Loader
          containerStyles={container}
          dataStyles={data}
        />
      }>
        <Canvas className="system-canvas max-h-[400px]" camera={{ position: [-5, 0, -15], fov: 55 }}>
          <pointLight position={[10, 10, 10]} intensity={1.5} />
            <group rotation={[0, Math.PI, 0]} position={[0, 2.5, 0]}>
              <Model
                scale={[0.75, 0.75, 0.75]}
              />
            </group>
            <Environment files={environmentHDR} />
          <ContactShadows position={[0, -0.8, 0]} opacity={0.5} scale={20} blur={2} far={4.5} />
          <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2.2} maxPolarAngle={Math.PI / 2.2} />
        </Canvas>
      </Suspense>
    </>
  )
}
