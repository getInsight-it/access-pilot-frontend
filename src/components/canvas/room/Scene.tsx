import * as THREE from "three"
import { Suspense, useRef, useState } from "react"
import { Canvas, useThree, useFrame, extend } from "@react-three/fiber"
import {
  AccumulativeShadows,
  RandomizedLight,
  Environment,
  useAspect,
  useTexture,
  useVideoTexture,
} from "@react-three/drei"

import Room from "./Room"

// camera controls
import CameraControls from "camera-controls"
import { Typing } from "../Typing"
import { useTheme } from "../../layout/ThemeToggle/theme-provider"
CameraControls.install({ THREE })
extend({ CameraControls })

// camera controls
let cameraControlsRef

function Controls() {
  cameraControlsRef = useRef<CameraControls>(null)
  const { camera, gl } = useThree()

  useFrame((state: any, delta: number) => cameraControlsRef.current?.update(delta))

  const [zoom, setZoom] = useState(false)

  const [vec] = useState(() => new THREE.Vector3())

  return (
    <cameraControls
      ref={cameraControlsRef}
      args={[camera, gl.domElement]}
      minZoom={2.1}
      maxZoom={4.5}
      maxDistance={4.5}
      maxPolarAngle={Math.PI / 2}
      minPolarAngle={0}
      // maxPolarAngle={Math.PI * 0.48}
      // minPolarAngle={Math.PI / 2.3}
      // minAzimuthAngle={-Math.PI * 0.4}
      // maxAzimuthAngle={Math.PI * 0.6}
      smoothTime={0.05}
      dollyToCursor=""
      mouseButtons={{
        left: CameraControls.ACTION.ROTATE,
        middle: CameraControls.ACTION.NONE,
        right: CameraControls.ACTION.NONE,
        shiftLeft: CameraControls.ACTION.NONE,
        wheel: CameraControls.ACTION.ZOOM,
      }}
    />
  )
}

function LaptopScreen() {
  const size = useAspect(2, 1)

  return (
    <mesh scale={[0.200, 0.134, 0]} rotation={[0, Math.PI / 2 + 0.06, 0]} position={[-0.719, -0.08, 0.104]}>
      <planeGeometry />
      <Suspense fallback={<FallbackMaterial url="/code.jpg" />}>
        <VideoMaterial url="/models/video.mp4" />
      </Suspense>
    </mesh>
  )
}

type MaterialProps = {
  url: string
}

function VideoMaterial({ url }: MaterialProps) {
  const texture = useVideoTexture(url)
  return <meshBasicMaterial map={texture} toneMapped={false} />
}

function FallbackMaterial({ url }: MaterialProps) {
  const texture = useTexture(url)
  return <meshBasicMaterial map={texture} toneMapped={false} />
}

type CameraPosition = {
  positionX: number
  positionY: number
  positionZ: number
  targetX: number
  targetY: number
  targetZ: number
  enable: boolean
}

export default function Scene() {
  const cameraPositions: CameraPosition[] = [
    {
      positionX: 2.99,
      positionY: 0.9,
      positionZ: 3.5,
      targetX: 0.44,
      targetY: 0.4,
      targetZ: 0.7,
      enable: true,
    },
    // {
    //   positionX: 1.0,
    //   positionY: 0.5,
    //   positionZ: 1.0,
    //   targetX: 0.0,
    //   targetY: 0.0,
    //   targetZ: 0.0,
    //   enable: true,
    // },
    // {
    //   positionX: -0.15,
    //   positionY: 1.65,
    //   positionZ: 1.7,
    //   targetX: 0.0,
    //   targetY: 0.85,
    //   targetZ: 0.9,
    //   enable: true,
    // },
    // {
    //   positionX: 0.8,
    //   positionY: -0.15,
    //   positionZ: 1.7,
    //   targetX: 0.9,
    //   targetY: -0.15,
    //   targetZ: -0.5,
    //   enable: true,
    // },
  ]

  function posicionaCamera(index: number) {
    cameraControlsRef.current?.reset(true)
    posCam(cameraPositions[index])
    if (cameraControlsRef.current) {
      cameraControlsRef.current.enabled = false
    }
  }

  function resetarCamera() {
    cameraControlsRef.current?.reset(true)
    if (cameraControlsRef.current) {
      cameraControlsRef.current.enabled = true
    }
  }

  const posCam = (cameraPosition: CameraPosition) => {
    cameraControlsRef.current?.setLookAt(
      cameraPosition.positionX,
      cameraPosition.positionY,
      cameraPosition.positionZ,
      cameraPosition.targetX,
      cameraPosition.targetY,
      cameraPosition.targetZ,
      cameraPosition.enable,
    )
  }

  const { theme } = useTheme();
    
  // apartment, city, dawn, forest, lobby, night, park, studio, sunset, warehouse
  const environmentHDR = theme === 'dark'
    ? '/hdr/warehouse.hdr'
    : theme === 'tangerine'
    ? '/hdr/lobby.hdr'  // Caminho para o HDR do tema tangerine
    : '/hdr/warehouse.hdr';  // Tema claro usa o HDR padrão

  return (
    <Canvas
      shadows
      camera={{
        position: [-10, 2.1, 10],
        rotation: [0, -Math.PI / 2, 0],
        fov: 35,
        zoom: 2.1
      }}>
      {/* <color attach="background" args={["goldenrod"]} /> */}
      
      {/* <fog attach="fog" args={["#ffffff", 2, 40]} /> */}

      <group
        position-y={0.5}
        position-x={0.5}
        dispose={null}
      >
        
        <LaptopScreen />
        
        <mesh
          castShadow
          receiveShadow
          // position={[-0.66, -0.13, 0.32]}
          position={[-0.60, -0.13, 0.52]}
          onClick={() => posicionaCamera(0)}
        >
          <boxGeometry args={[0.05, 0.05, 0.05]} />
          <meshStandardMaterial color={'red'} />
        </mesh>
        
        <Typing
          scale={[0.04, 0.04, 0.04]}
          position={[-0.33, -0.45, 0.08]}
          rotation={[0, -Math.PI / 2, 0]}
          onClick={resetarCamera}
        />

        <Room
          position={[0, -0.5, 0]}
        />
        
        <AccumulativeShadows
          temporal
          frames={100}
          color="#ffffff"
          colorBlend={2}
          toneMapped={true}
          alphaTest={0.75}
          opacity={0.73}
          scale={10}
          position={[0, -0.5, 0]}
        >
          <RandomizedLight amount={8} radius={4} ambient={0.5} intensity={Math.PI} position={[5, 5, -10]} bias={0.001} />
        </AccumulativeShadows>
      </group>

      <Environment files={environmentHDR} />

      <Controls />
      {/* <OrbitControls /> */}
    </Canvas>
  )
}

