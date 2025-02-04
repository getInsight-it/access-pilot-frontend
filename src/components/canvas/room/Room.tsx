import React from "react"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"

type GLTFResult = {
  nodes: {
    [key: string]: THREE.Mesh
  }
  materials: {
    [key: string]: THREE.Material
  }
}

export default function Room(props) {
  const { nodes, materials } = useGLTF("/models/room.glb") as unknown as GLTFResult

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.teclado.geometry}
        material={materials["Keyboard.003"]}
        position={[-0.67, 0.351, 0.1]}
        rotation={[-Math.PI, 1.51, -Math.PI]}
      />
      <group position={[-0.64, 0.35, 0.1]} rotation={[-Math.PI, 1.51, -Math.PI]}>
        <mesh castShadow receiveShadow geometry={nodes.body_1.geometry} material={materials["Steel.002"]} />
        <mesh geometry={nodes.body_2.geometry} material={materials.blackmatte} />
        <mesh castShadow receiveShadow geometry={nodes.body_3.geometry} material={materials.metal} />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mouse.geometry}
        material={materials.White}
        position={[-0.68, 0.35, -0.08]}
        rotation={[Math.PI, -1.31, Math.PI]}
        scale={0.19}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesa.geometry}
        material={materials.White}
        position={[0.91, 0.01, -0.38]}
        rotation={[Math.PI, 0, Math.PI]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.gaveteiro.geometry}
        material={materials.White}
        position={[0.91, 0.01, -0.38]}
        rotation={[Math.PI, 0, Math.PI]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.cadeira.geometry}
        material={materials.Black}
        position={[-0.31, 0.25, 0.07]}
        rotation={[0, 0.72, 0]}
      >
        {/* <meshStandardMaterial color={'gray'} /> */}
      </mesh>
      {/* <mesh castShadow receiveShadow geometry={nodes.viewdeck.geometry} material={materials.viewdeck} position={[-0.77, 0.39, 0.38]} rotation={[1.57, 0, -1.18]} scale={0.78} /> */}
      {/* <mesh castShadow receiveShadow geometry={nodes.basev.geometry} material={materials.basev} position={[-0.77, 0.34, 0.38]} rotation={[Math.PI, -1.45, Math.PI]} /> */}
      {/* <mesh geometry={nodes.puff2.geometry} material={materials.Black} position={[0.2, -0.06, -0.8]} /> */}
      {/* <mesh geometry={nodes.puff.geometry} material={materials.Black} position={[0.2, -0.06, -0.8]} /> */}
      {/* <mesh
        castShadow
        receiveShadow
        geometry={nodes.pes.geometry}
        material={materials.pes}
        position={[0.2, -0.06, -0.8]}
      /> */}
      {/* <mesh
        castShadow
        receiveShadow
        geometry={nodes.sofa.geometry}
        // material={materials.puff}
        material={materials.White}
        position={[0.2, -0.06, -0.8]}
      /> */}
      {/* <mesh
        castShadow
        receiveShadow
        geometry={nodes.lampcover.geometry}
        material={materials.lampEmission}
        position={[-0.73, 0.61, -0.75]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.lightpole.geometry}
        material={materials.steel}
        position={[-0.73, 0.14, -0.75]}
      /> */}
      <group position={[-0.83, 0.38, -0.22]} rotation={[-Math.PI, 0.82, -Math.PI]} scale={0.05}>
        <mesh castShadow receiveShadow geometry={nodes.vaso_1.geometry} material={nodes.vaso_1.material} />
        <mesh castShadow receiveShadow geometry={nodes.vaso_2.geometry} material={materials.Dirt} />
        <mesh castShadow receiveShadow geometry={nodes.vaso_3.geometry} material={materials.LeafLight} />
        <mesh castShadow receiveShadow geometry={nodes.vaso_4.geometry} material={materials.Leaf} />
      </group>
    </group>
  )
}

useGLTF.preload("/models/room.glb")

