import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { GroupProps } from '@react-three/fiber';
import { useTheme } from 'next-themes';

interface MapProps extends GroupProps {
  // Defina quaisquer outras propriedades adicionais se necessário
}

export default function Terreno(props: MapProps) {
  const { nodes, materials } = useGLTF('/terreno.glb') as any;

  const { theme } = useTheme();
  const terrainMaterial = theme === 'dark' ? '#ff0000' : '#ffffff';

  return (
    <RigidBody type="fixed" colliders="trimesh" ccd>
      <group {...props} dispose={null}>
        <group rotation={[0, 0, 0]} scale={0.9}>
          <mesh castShadow receiveShadow geometry={nodes.terreno.geometry} material={nodes.terreno.material} rotation={[0, 0.014, 0]} scale={3.626}>
            <meshStandardMaterial color={terrainMaterial} />
          </mesh>
        </group>
      </group>
    </RigidBody>
  );
}

useGLTF.preload('/terreno.glb')