import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { GroupProps } from '@react-three/fiber';

interface MapProps extends GroupProps {
  // Defina quaisquer outras propriedades adicionais se necessário
}

export default function Map(props: MapProps) {
  const { nodes, materials } = useGLTF('/fantasy_game_inn.glb') as any;

  return (
    <RigidBody type="fixed" colliders="trimesh" ccd>
      <group {...props} dispose={null}>
        <group rotation={[-Math.PI / 2, 0, 0]} scale={0.11}>
          <mesh castShadow receiveShadow geometry={nodes.TheInn_bakeInn_0.geometry}>
            <meshStandardMaterial map={materials.bakeInn.map} />
          </mesh>
        </group>
      </group>
    </RigidBody>
  );
}

useGLTF.preload('/fantasy_game_inn.glb');
