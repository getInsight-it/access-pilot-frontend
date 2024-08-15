import { useFrame } from '@react-three/fiber'
import { Color } from 'three'
import { Text } from '@react-three/drei'
import { useGLTF } from '@react-three/drei'
import { useMemo, useRef, useState } from 'react'

export default function Capacete({ text, ...props }) {
  const ref = useRef()
  const black = useMemo(() => new Color('black'), [])
  const lime = useMemo(() => new Color('lime'), [])
  const [hovered, setHovered] = useState(false)

  const { nodes, materials } = useGLTF('/capacete-transformed.glb')

  useFrame(({ mouse, viewport }) => {
    const x = (mouse.x * viewport.width) / 2.5
    const y = (mouse.y * viewport.height) / 2.5
    ref.current.lookAt(x, y, 1)
    ref.current.material.color.lerp(hovered ? lime : black, 0.05)
  })

  return (
    <mesh
      {...props}
      ref={ref}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={[3,3,3]}
    >
      {/* <boxGeometry /> */}

        <mesh geometry={nodes.helmet.geometry} material={materials.Helmet34}>
            {/* <meshStandardMaterial color={lime} /> */}
        </mesh>
        <mesh geometry={nodes.bigode.geometry} material={materials['MI_Spongebob_Mustache.001']} />
        <mesh geometry={nodes.Cube001_Material002_0.geometry} material={materials['Material.002']} />
        <mesh geometry={nodes.Cube_Material004_0.geometry} material={materials['Material.004']} />
        <mesh geometry={nodes.Sphere001_Material001_0.geometry} material={materials['Material.001']} />
      
        
    </mesh>
  )
}

useGLTF.preload('/capacete-transformed.glb')
