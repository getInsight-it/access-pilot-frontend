import { Environment, Html, OrbitControls, PresentationControls, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React from 'react'

function Laptop() {
  // const laptop = useGLTF('/mac-draco.glb');
  const laptop = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf');
  return (
    <>
      <Canvas
        className="system-canvas"
        camera={{
          fov: 45,
          near: 0.1,
          far: 2000,
          position: [-3, 1.5, 4]
        }}
      >
        <Environment preset='warehouse' />
        {/* <PresentationControls global polar={[-0.4, 0.2]} azimuth={[-0.4, 0.2]}>
        </PresentationControls> */}
          <primitive object={laptop.scene} position-y={-1.2}>
            <Html
              wrapperClass="laptop"
              position={[0, 1.57, -1.4]}
              transform
              distanceFactor={1.10}
              rotation-x={-0.25}
            >
              <iframe src="https://svgenius.co" />
            </Html>

          </primitive>
        <OrbitControls />
      </Canvas>

    </>
  )
}

export default Laptop